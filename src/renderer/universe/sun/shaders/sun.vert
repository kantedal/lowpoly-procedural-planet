#pragma glslify: snoise3 = require("glsl-noise/simplex/3d")
#pragma glslify: cnoise3 = require("glsl-noise/classic/3d")

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vCenteredPosition;
varying vec3 vNormal;

uniform float time;

void main() {
    float noise = cnoise3((position.xyz) * 1.0 + vec3(time * 3.0)) * 2.0;
    vCenteredPosition = position + normal * noise;

    vUv = uv;
    vPosition = vec3(modelMatrix * vec4(vCenteredPosition, 1.0));
    vNormal = vec3(modelMatrix * vec4(normal, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vCenteredPosition, 1.0);
}