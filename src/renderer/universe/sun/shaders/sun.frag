#extension GL_OES_standard_derivatives : enable
#pragma glslify: snoise3 = require("glsl-noise/simplex/3d")

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vCenteredPosition;

uniform vec3 sunPosition;
uniform float time;

vec3 shading(vec3 kd, vec3 ka, vec3 normal) {
    return max(0.0, dot(normalize(cameraPosition - vPosition), normal)) * kd + ka;
}

void main() {
    vec3 dX = dFdx(vPosition);
    vec3 dY = dFdy(vPosition);
    vec3 normal = normalize(cross(dX, dY));
    gl_FragColor = vec4(shading(vec3(0.8, 0.8, 0.0), vec3(0.8, 0.3, 0.0), normal), 1.0);
}