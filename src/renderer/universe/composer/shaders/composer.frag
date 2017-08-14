uniform sampler2D universeTexture;
uniform sampler2D skyTexture;
uniform sampler2D glowTexture;

varying vec2 vUv;

void main(void) {
    vec4 universeColor = texture2D( universeTexture, vUv );
    vec4 skyColor = texture2D( skyTexture, vUv );
    vec4 glowColor = texture2D( glowTexture, vUv );

    vec4 color;
    if (universeColor.a == 0.0) {
        color = vec4(skyColor.xyz, 1.0);
    }
    else {
        color = universeColor;
    }

    gl_FragColor = color + 0.5 * glowColor;
}