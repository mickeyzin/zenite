"""Gera o GLB com peças separadas + volume de líquido.

Entrada: GLB original do Meshy e os rótulos de segment.py.
Saída: GLB com um nó por peça (mesma textura e UV do original, ou seja, mesma
aparência) e um nó "liquid" gerado por voxelização do interior.
Uso: build_parts.py <glb> <config> <labels.npz> <saida.glb>
"""
import json, sys
import numpy as np, trimesh
from scipy import ndimage
from skimage import measure

glb, cfg_name, labels_path, out = sys.argv[1:5]
CFG = json.load(open(__file__.replace("build_parts.py", "parts.json")))[cfg_name]
LQ = CFG["liquid"]

src = list(trimesh.load(glb, force="scene", process=False).geometry.values())[0]
data = np.load(labels_path)
lab, names = data["labels"], [str(n) for n in data["names"]]
scene = trimesh.Scene()

for i, name in enumerate(names):
    faces = src.faces[lab == i]
    if len(faces) == 0:
        continue
    used, inv = np.unique(faces, return_inverse=True)
    mat = src.visual.material.copy()
    mat.name = name
    part = trimesh.Trimesh(
        vertices=src.vertices[used], faces=inv.reshape(-1, 3),
        vertex_normals=src.vertex_normals[used],
        visual=trimesh.visual.TextureVisuals(uv=src.visual.uv[used], material=mat),
        process=False,
    )
    scene.add_geometry(part, node_name=name, geom_name=name)
    print(f"{name:>10}: {len(part.faces)} faces")

# ——— Líquido ———
pitch = LQ.get("pitch", 0.008)
vox = src.voxelized(pitch)
filled = ndimage.binary_fill_holes(vox.matrix)
pad = 4
grid = np.pad(filled, pad)
dist = ndimage.distance_transform_edt(grid) * pitch          # distância até a casca externa
origin = vox.transform[:3, 3] - pad * pitch                  # centro do voxel [0,0,0]
idx = np.indices(grid.shape).reshape(3, -1).T
pos = (idx * pitch + origin).reshape(*grid.shape, 3)
y = pos[..., 1]
inside = dist > LQ["wall"]
inside &= y > LQ["bottom"]
inside &= y < LQ["top"]
if "region" in LQ:   # restrição extra opcional (ex.: só dentro do anel do Prada)
    X, Y, Z = pos[..., 0], pos[..., 1], pos[..., 2]
    inside &= eval(LQ["region"], {"np": np, "x": X, "y": Y, "z": Z})
# Mantém só o maior volume conectado
lbl, n = ndimage.label(inside)
if n > 1:
    sizes = ndimage.sum(inside, lbl, range(1, n + 1))
    inside = lbl == (np.argmax(sizes) + 1)
# Pontos que preenchem o volume do líquido: o site usa para manter o volume
# constante quando o frasco inclina (acha a altura da superfície por quantil).
rng = np.random.default_rng(7)
inner = pos[inside]
sel = rng.choice(len(inner), size=min(1500, len(inner)), replace=False)
vol_pts = (inner[sel] + rng.uniform(-pitch / 2, pitch / 2, size=(len(sel), 3))).round(4)
field = ndimage.gaussian_filter(inside.astype(np.float32), sigma=LQ.get("smooth", 1.6))
verts, faces, normals, _ = measure.marching_cubes(field, level=0.5)
verts = verts * pitch + origin
liquid = trimesh.Trimesh(verts, faces[:, ::-1], process=True)
liquid.fix_normals()
trimesh.smoothing.filter_taubin(liquid, iterations=12)
target = LQ.get("faces", 6000)
if len(liquid.faces) > target:
    try:
        liquid = liquid.simplify_quadric_decimation(face_count=target)
    except Exception as e:  # dependência opcional
        print("simplificação do líquido ignorada:", e)
lmat = trimesh.visual.material.PBRMaterial(name="liquid", baseColorFactor=LQ.get("color", [0.2, 0.4, 1.0, 1.0]), metallicFactor=0.0, roughnessFactor=0.1)
liquid.visual = trimesh.visual.TextureVisuals(material=lmat)
scene.add_geometry(liquid, node_name="liquid", geom_name="liquid")
b = liquid.bounds
print(f"    liquid: {len(liquid.faces)} faces, watertight={liquid.is_watertight}, bounds={b.round(3).tolist()}, volume={liquid.volume*1e6/ (2/np.ptp(src.bounds[:,1]))**3:.0f} (unid. relativas)")
scene.export(out)
import json as _json
pts_path = out.replace(".raw.glb", ".liquid.json")
_json.dump({"points": vol_pts.reshape(-1).tolist()}, open(pts_path, "w"), separators=(",", ":"))
print(f"    pontos de volume: {len(vol_pts)} → {pts_path}")
