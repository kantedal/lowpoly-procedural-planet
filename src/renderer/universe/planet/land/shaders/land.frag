#extension GL_OES_standard_derivatives : enable

#pragma glslify: snoise3 = require("glsl-noise/simplex/3d")

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 sunPosition;
uniform float oceanLevel;
uniform float time;
uniform float planetTemperature;

vec3 phong(vec3 ka, vec3 kd, vec3 ks, float alpha, vec3 normal) {
    vec3 n = normalize( normal );
    vec3 s = normalize( vPosition - sunPosition );
    vec3 v = normalize( vPosition - cameraPosition );
    vec3 r = reflect( -s, n );

    vec3 ambient = max(0.0, dot(normalize(cameraPosition), normal)) * ka;
    vec3 diffuse = max(0.0, dot(normalize(sunPosition), normal)) * kd;
    vec3 specular = pow(max(dot(r,v), 0.0), alpha) * ks;

    return ambient + diffuse + specular;
}

vec3 calculateColor(vec3 sand, vec3 grass, vec3 ice) {
  float grassToSand = pow(2.0 * (clamp(planetTemperature / 40.0, 0.0, 1.0) - 0.5), 1.0);
  vec3 grassSandColor = mix(sand, grass, step(grassToSand, snoise3(vPosition * 0.5) * snoise3(vPosition * 0.2)));

  float grassToIce = pow(2.0 * (clamp((planetTemperature + 5.0) / 5.0, 0.0, 1.0) - 0.5), 3.0);
  vec3 grassSnowColor = mix(grass, ice, step(grassToIce, snoise3(vPosition * 0.5) * snoise3(vPosition * 0.2)));

  return mix(grassSandColor, grassSnowColor, step(planetTemperature, 0.0));
}

void main() {
  vec3 dX = dFdx(vPosition);
  vec3 dY = dFdy(vPosition);
  vec3 normal = normalize(cross(dX, dY));

  vec3 sandAmbientColor = vec3(0.15, 0.1, 0.1);
  vec3 sandDiffuseColor = vec3(0.4, 0.38, 0.3);
  vec3 sandSpecularColor = vec3(0.1, 0.1, 0.1);

  vec3 grassAmbientColor = vec3(0.03, 0.1, 0.05);
  vec3 grassDiffuseColor = vec3(0.1, 0.2, 0.1);
  vec3 grassSpecularColor = vec3(0.1);

  vec3 iceAmbientColor = vec3(0.1, 0.1, 0.1);
  vec3 iceDiffuseColor = vec3(0.7, 0.7, 0.7);
  vec3 iceSpecularColor = vec3(0.4);

  float height = length(vPosition);
  vec3 ambientColor = calculateColor(sandAmbientColor, grassAmbientColor, iceAmbientColor);
  vec3 diffuseColor = calculateColor(sandDiffuseColor, grassDiffuseColor, iceDiffuseColor);
  vec3 specularColor = calculateColor(sandSpecularColor, grassSpecularColor, iceSpecularColor);


  ambientColor = mix(vec3(0.1), ambientColor, clamp(0.5 * (height - oceanLevel), 0.0, 1.0));
  diffuseColor = mix(vec3(0.45, 0.4, 0.4), diffuseColor, pow(clamp(0.85 * (height - oceanLevel), 0.0, 1.0), 15.0));

  vec3 phongColor = phong(ambientColor, diffuseColor, specularColor, 10.0, normal);
  vec3 flatAmbient = vec3(0.0, 0.0, 0.0);
  gl_FragColor = vec4(phongColor + flatAmbient, 1.0);
}