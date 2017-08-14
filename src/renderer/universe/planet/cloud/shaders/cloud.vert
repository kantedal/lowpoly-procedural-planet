#pragma glslify: snoise3 = require("glsl-noise/simplex/3d")

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float time;

void main() {
    vec3 newPosition =  position;// + snoise3(position * 0.1) * 1.0;

    vUv = uv;
    vPosition = vec3(modelMatrix * vec4(newPosition, 1.0));
    vNormal = vec3(modelMatrix * vec4(normal, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}