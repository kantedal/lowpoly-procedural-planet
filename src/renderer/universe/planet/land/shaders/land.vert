#pragma glslify: snoise3 = require("glsl-noise/simplex/3d")
#pragma glslify: cnoise3 = require("glsl-noise/classic/3d")

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float planetRadius;
uniform float planetSeed;
uniform float planetFrequency;
uniform float planetAmplitude;

void main() {
    vec3 seed = vec3(planetSeed);

    // Sink ground for ocean
    float lowFreqLandNoise = max(pow(planetAmplitude * cnoise3(planetFrequency * (seed + vec3(24.0, 13.0, 1.0) + position * 1.0)), 1.0) * 4.0, 0.0);
    float medFreqLandNoise = 0.6 * max(pow(planetAmplitude * cnoise3(planetFrequency * (seed + vec3(6.0, 1.0, 15.0) + position * 2.6)), 1.0) * 4.0, 0.0);
    float highFreqLandNoise = 0.1 * planetAmplitude * snoise3(planetFrequency * (position * 10.0));

    // Add some noise to ground
   // vec3 groundNoise = snoise3(position * 0.2) * 0.5;

    vec3 newPosition = position - normal * planetRadius;
    newPosition = newPosition + normal * (lowFreqLandNoise + medFreqLandNoise + highFreqLandNoise);

    //vec3 newPosition = position + normal * (lowFreqOceanNoise + medFreqOceanNoise);
    vUv = uv;
    vPosition = vec3(modelMatrix * vec4(newPosition, 1.0));
    vNormal = vec3(modelMatrix * vec4(normal, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}