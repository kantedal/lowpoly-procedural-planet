#extension GL_OES_standard_derivatives : enable

varying vec2 vUv;
varying vec3 vPosition;

uniform vec3 sunPosition;
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

void main() {
  vec3 dX = dFdx(vPosition);
  vec3 dY = dFdy(vPosition);
  vec3 normal = normalize(cross(dX, dY));

  vec3 iceAmbientColor = vec3(0.1, 0.1, 0.1);
  vec3 waterAmbientColor = vec3(0.0, 0.05, 0.1);
  vec3 ambientColor = mix(waterAmbientColor, iceAmbientColor, step(planetTemperature, 0.0));

  vec3 iceDiffuseColor = vec3(0.5, 0.5, 0.55);
  vec3 waterDiffuseColor = vec3(0.05, 0.15, 0.4);
  vec3 diffuseColor = mix(waterDiffuseColor, iceDiffuseColor, step(planetTemperature, 0.0));

//  vec3 iceSpecularColor = vec3(0.5, 0.5, 0.55);
//  vec3 waterSpecularColor = vec3(0.05, 0.15, 0.4);
//  vec3 specularColor = mix(waterDiffuseColor, iceDiffuseColor, step(planetTemperature, 0.0));

  gl_FragColor = vec4(phong(ambientColor, diffuseColor, vec3(0.8), 3.0, normal), 1.0);
}