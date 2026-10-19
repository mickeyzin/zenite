"""Analisa um GLB do Meshy: amostra cor/metal/rugosidade por triângulo e relata a distribuição."""
import sys, numpy as np, trimesh
from PIL import Image

path = sys.argv[1]
scene = trimesh.load(path, force="scene", process=False)
mesh = list(scene.geometry.values())[0]
mat = mesh.visual.material
uv = mesh.visual.uv
base = np.asarray(mat.baseColorTexture.convert("RGB"), dtype=np.float32) / 255
mr = np.asarray(mat.metallicRoughnessTexture.convert("RGB"), dtype=np.float32) / 255
H, W = base.shape[:2]

def sample(img, uvs):
    x = np.clip((uvs[:, 0] % 1) * (W - 1), 0, W - 1).astype(int)
    y = np.clip((1 - uvs[:, 1] % 1) * (H - 1), 0, H - 1).astype(int)
    return img[y, x]

f = mesh.faces
cuv = uv[f].mean(axis=1)
col = sample(base, cuv); m = sample(mr, cuv)
rough, metal = m[:, 1], m[:, 2]
cen = mesh.triangles_center
print("faces", len(f), "watertight", mesh.is_watertight, "bounds", mesh.bounds.round(3).tolist())
print("euler", mesh.euler_number)
# Histograma por altura
ys = np.linspace(mesh.bounds[0, 1], mesh.bounds[1, 1], 21)
for a, b in zip(ys[:-1], ys[1:]):
    s = (cen[:, 1] >= a) & (cen[:, 1] < b)
    if s.sum() == 0: continue
    print(f"y {a:+.2f}..{b:+.2f} n={s.sum():6d} rgb={col[s].mean(0).round(2)} metal={metal[s].mean():.2f} rough={rough[s].mean():.2f} xw={np.ptp(cen[s,0]):.2f} zw={np.ptp(cen[s,2]):.2f}")
np.savez(sys.argv[2], col=col, metal=metal, rough=rough, cen=cen, normals=mesh.face_normals, area=mesh.area_faces)
