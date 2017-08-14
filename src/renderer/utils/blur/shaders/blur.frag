#pragma glslify: blur3 = require("glsl-fast-gaussian-blur/13")

uniform vec2 resolution;
uniform sampler2D inputTexture;
uniform vec2 direction;
uniform float blurSize;

varying vec2 vUv;
//
//void main() {
//  vec2 uv = vec2(gl_FragCoord.xy / resolution.xy);
//  gl_FragColor = blur(inputTexture, uv, resolution.xy, direction);
//  //gl_FragColor = vec4(texture2D(inputTexture, vUv).rgb, 1.0);
//}

void main() {
    float blurFactor = blurSize;
    vec3 clr = blur3(inputTexture, vUv, resolution.xy, direction).xyz;

    vec3 minVal = vec3(0.0);
    vec3 maxVal = vec3(1.0);
    gl_FragColor = vec4(clamp(clr, minVal, maxVal), 1.0);
}