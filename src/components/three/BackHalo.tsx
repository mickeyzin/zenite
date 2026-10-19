"use client";

import { useMemo } from "react";
import * as THREE from "three";

/** Brilho difuso atrás do frasco para destacar a silhueta contra o espaço. */
export function BackHalo({ color = "#1f6bff", scale = 5.5, opacity = 0.55 }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } }),
    [color, opacity],
  );
  return (
    <mesh position={[0, 0.1, -1.6]} scale={[scale, scale * 1.15, 1]} renderOrder={-2}>
      <planeGeometry />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
        fragmentShader={`uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv;
          void main(){ float r=length(vUv-0.5)*2.0; float a=pow(max(1.0-r,0.0),2.4)*uOpacity; gl_FragColor=vec4(uColor*a,a);} `}
      />
    </mesh>
  );
}
