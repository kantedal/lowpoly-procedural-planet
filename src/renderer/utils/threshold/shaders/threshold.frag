varying vec2 vUv;
varying vec3 vPosition;

uniform float threshold;
uniform sampler2D universeTexture;

void main() {
    vec3 color = texture2D(universeTexture, vUv).rgb;
    float mag = length(color);

    if (mag > threshold) {
        gl_FragColor = vec4(color, 1.0);
    }
    else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}