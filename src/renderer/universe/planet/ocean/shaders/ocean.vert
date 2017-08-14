#pragma glslify: snoise3 = require("glsl-noise/simplex/3d")

varying vec2 vUv;
varying vec3 vPosition;

uniform float oceanLevel;
uniform float time;
uniform float planetTemperature;

void main() {
    vec3 newPosition = position - normal * oceanLevel;

    if (planetTemperature > 0.0) {
      newPosition = newPosition + snoise3(1.5 * vec3(time) + position * 3.0) * 0.2;
    }

    vUv = uv;
    vPosition = vec3(modelMatrix * vec4(newPosition, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}