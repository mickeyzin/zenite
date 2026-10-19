"""Separa um GLB do Meshy (malha única) em peças por triângulo, usando a textura.

Rótulos por regra (cor, metal, posição) → suavização por voto de vizinhos →
imagem de conferência (frente/lado/costas) com cada peça numa cor.
Uso: segment.py <glb> <config> <saida.npz> <preview.png>
"""
import json, sys
import numpy as np, trimesh
from PIL import Image, ImageDraw
from scipy import sparse

glb, cfg_name, out_npz, out_png = sys.argv[1:5]
CFG = json.load(open(__file__.replace("segment.py", "parts.json")))[cfg_name]
LABELS = CFG["labels"]

mesh = list(trimesh.load(glb, force="scene", process=False).geometry.values())[0]
mat = mesh.visual.material
base = np.asarray(mat.baseColorTexture.convert("RGB"), dtype=np.float32) / 255
mr = np.asarray(mat.metallicRoughnessTexture.convert("RGB"), dtype=np.float32) / 255
H, W = base.shape[:2]
uv = mesh.visual.uv
f = mesh.faces

def sample(img, uvs):
    x = np.clip((uvs[:, 0] % 1) * (W - 1), 0, W - 1).astype(int)
    y = np.clip((1 - uvs[:, 1] % 1) * (H - 1), 0, H - 1).astype(int)
    return img[y, x]

# Média de 4 amostras por triângulo (centro + 3 pontos internos) para reduzir ruído.
tri_uv = uv[f]
pts = [tri_uv.mean(1)] + [(tri_uv.mean(1) * 2 + tri_uv[:, k]) / 3 for k in range(3)]
col = np.mean([sample(base, p) for p in pts], axis=0)
mrs = np.mean([sample(mr, p) for p in pts], axis=0)
metal, rough = mrs[:, 2], mrs[:, 1]
cen = mesh.triangles_center
r, g, b = col[:, 0], col[:, 1], col[:, 2]
mx, mn = col.max(1), col.min(1)
sat = (mx - mn) / np.maximum(mx, 1e-3)
y = cen[:, 1]

# Regras: avaliadas em ordem; a última que casar vence. Cada regra é uma expressão numpy.
# Superfície das placas (frente/trás): mediana de z das faces planas voltadas para ±z.
flat_front = (mesh.face_normals[:, 2] > 0.95) & (np.abs(cen[:, 0]) < 0.3)
flat_back = (mesh.face_normals[:, 2] < -0.95) & (np.abs(cen[:, 0]) < 0.3)
zf = float(np.median(cen[flat_front, 2])) if flat_front.any() else 0.0
zb = float(np.median(cen[flat_back, 2])) if flat_back.any() else 0.0
print(f"placa frontal z={zf:.3f} traseira z={zb:.3f}")
env = dict(zf=zf, zb=zb, r=r, g=g, b=b, sat=sat, metal=metal, rough=rough, y=y, x=cen[:, 0], z=cen[:, 2],
           nx=mesh.face_normals[:, 0], ny=mesh.face_normals[:, 1], nz=mesh.face_normals[:, 2], np=np)
lab = np.full(len(f), LABELS.index(CFG["default"]), dtype=np.int32)
def sphere_select(rule):
    """Ajusta uma esfera aos triângulos que casam com a regra (um grupo por lado em z)
    e seleciona tudo dentro dela: útil para gemas e medalhões salientes."""
    seed = eval(rule["sphere_of"], {}, env)
    sel = np.zeros(len(f), bool)
    for side in (cen[:, 2] > 0, cen[:, 2] <= 0):
        pts = cen[seed & side]
        if len(pts) < 50:
            continue
        c = np.median(pts, axis=0)
        rad = np.percentile(np.linalg.norm(pts - c, axis=1), rule.get("pct", 92)) * rule.get("pad", 1.1)
        sel |= (np.linalg.norm(cen - c, axis=1) < rad) & side
    return sel

for rule in CFG["rules"]:
    sel = sphere_select(rule) if "sphere_of" in rule else eval(rule["when"], {}, env)
    rule["_sel"] = sel
    lab[sel] = LABELS.index(rule["label"])
    print(f"regra {rule['label']:>8}: {int(sel.sum())} faces")

# Suavização: voto majoritário entre faces que compartilham aresta (algumas iterações).
adj = mesh.face_adjacency
n = len(f)
A = sparse.coo_matrix((np.ones(len(adj) * 2), (np.r_[adj[:, 0], adj[:, 1]], np.r_[adj[:, 1], adj[:, 0]])), shape=(n, n)).tocsr()
locked = np.zeros(n, bool)
for rule in CFG["rules"]:
    if rule.get("lock"):
        locked |= rule["_sel"]
for _ in range(CFG.get("smooth", 4)):
    onehot = sparse.csr_matrix((np.ones(n), (np.arange(n), lab)), shape=(n, len(LABELS)))
    votes = (A @ onehot).toarray() + onehot.toarray() * 1.5
    new = votes.argmax(1)
    lab = np.where(locked, lab, new)

for i, L in enumerate(LABELS):
    print(f"{L:>8}: {int((lab == i).sum()):7d} faces  área {mesh.area_faces[lab == i].sum():.3f}")
np.savez_compressed(out_npz, labels=lab, names=np.array(LABELS))

# Imagem de conferência: projeção ortográfica com pintor por profundidade.
PALETTE = [(40, 120, 255), (230, 230, 235), (255, 200, 40), (255, 40, 60), (60, 220, 120), (200, 80, 255), (255, 130, 0)]
v = mesh.vertices
views = [("frente", 1.0), ("lado", None), ("costas", -1.0)]
S = 360
img = Image.new("RGB", (S * 3, S + 20), (12, 12, 20))
d = ImageDraw.Draw(img)
for k, (name, sgn) in enumerate(views):
    if sgn is None:   # lado: câmera em +x
        h, depth, nd = -v[:, 2], v[:, 0][f].mean(1), mesh.face_normals[:, 0]
    else:
        h, depth, nd = v[:, 0] * sgn, (v[:, 2] * sgn)[f].mean(1), mesh.face_normals[:, 2] * sgn
    order = np.argsort(depth)  # do fundo para a frente
    shade = np.clip(nd * 0.6 + 0.4, 0.15, 1)
    sx = (h * 0.45 + 0.5) * S + k * S
    sy = (0.5 - v[:, 1] * 0.45) * S + 20
    for i in order:
        c = tuple(int(cc * shade[i]) for cc in PALETTE[lab[i] % len(PALETTE)])
        d.polygon([(sx[t], sy[t]) for t in f[i]], fill=c)
    d.text((k * S + 8, 4), name, fill=(220, 220, 220))
leg = " ".join(f"{i}:{L}" for i, L in enumerate(LABELS))
ImageDraw.Draw(img).text((S + 60, 4), leg, fill=(200, 200, 200))
img.save(out_png)
