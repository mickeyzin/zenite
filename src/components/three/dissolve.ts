import * as THREE from "three";

/**
 * Dissolução com borda luminosa, aplicável a qualquer material do three.js.
 * Uma linha de luz desce pelo frasco (de cima para baixo, com ruído) e tudo
 * acima dela some. 0 = inteiro, 1 = dissolvido. Reversível: só depende do valor.
 */
export interface DissolveUniforms {
  uDissolve: { value: number };
  uDisOrigin: { value: THREE.Vector3 };
  uDisHeight: { value: number };
  uDisEdge: { value: THREE.Color };
}

/**
 * Registro de dissoluções por frasco, fora do React: a cena escreve o valor a
 * cada quadro e os materiais do frasco leem os mesmos objetos.
 */
const registry = new Map<string, DissolveUniforms>();
export function getDissolve(key: string, edge?: string) {
  let u = registry.get(key);
  if (!u) {
    u = createDissolve(edge);
    registry.set(key, u);
  } else if (edge) {
    u.uDisEdge.value.set(edge);
  }
  return u;
}

export function createDissolve(edge = "#9fe3ff"): DissolveUniforms {
  return {
    uDissolve: { value: 0 },
    uDisOrigin: { value: new THREE.Vector3() },
    uDisHeight: { value: 2 },
    uDisEdge: { value: new THREE.Color(edge) },
  };
}

const NOISE = /* glsl */ `
  varying vec3 vDisWorld;
  uniform float uDissolve, uDisHeight; uniform vec3 uDisOrigin, uDisEdge;
  float disEdge = 0.0;
  float disHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float disNoise(vec3 x){
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(disHash(i), disHash(i + vec3(1,0,0)), f.x), mix(disHash(i + vec3(0,1,0)), disHash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(disHash(i + vec3(0,0,1)), disHash(i + vec3(1,0,1)), f.x), mix(disHash(i + vec3(0,1,1)), disHash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
`;

const MAIN = /* glsl */ `
  if (uDissolve > 0.0005) {
    float hgt = clamp((vDisWorld.y - uDisOrigin.y) / uDisHeight + 0.5, 0.0, 1.0);
    float nz = disNoise(vDisWorld * 7.0) * 0.6 + disNoise(vDisWorld * 19.0) * 0.4;
    float k = (1.0 - hgt) * 0.7 + nz * 0.3;
    float th = uDissolve * 1.08 - 0.02;
    if (k < th) discard;
    disEdge = 1.0 - smoothstep(0.0, 0.05, k - th);
  }
`;

export function applyDissolve(material: THREE.Material, u: DissolveUniforms) {
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prev?.call(material, shader, renderer);
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vDisWorld;")
      .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvDisWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${NOISE}`)
      .replace("void main() {", `void main() {\n${MAIN}`)
      .replace("#include <dithering_fragment>", "#include <dithering_fragment>\n  gl_FragColor.rgb += uDisEdge * disEdge * 4.0;");
  };
  // Programa próprio (não reaproveitar o de um material sem dissolução).
  const prevKey = material.customProgramCacheKey?.bind(material);
  material.customProgramCacheKey = () => (prevKey ? prevKey() : "") + "|dissolve";
  material.needsUpdate = true;
}
