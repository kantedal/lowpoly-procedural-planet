#pragma glslify: cnoise3 = require("glsl-noise/classic/3d")

varying vec2 vUv;
varying vec3 vPosition;

uniform float time;

void main() {
    vec3 newPosition = position + normal * cnoise3(vec3(time) * 1.0 + position * 15.0) * 0.05;

    vUv = uv;
    vPosition = vec3(modelMatrix * vec4(newPosition, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}