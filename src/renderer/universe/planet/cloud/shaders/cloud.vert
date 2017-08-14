#pragma glslify: snoise3 = require("glsl-noise/simplex/3d")

varying vec3 vPosition;

uniform float time;

void main() {
    vec3 newPosition =  position;// + snoise3(position * 0.1) * 1.0;

    vPosition = vec3(modelMatrix * vec4(newPosition, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}