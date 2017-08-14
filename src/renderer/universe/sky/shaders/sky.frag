#pragma glslify: snoise3 = require("glsl-noise/simplex/3d")
#extension GL_OES_standard_derivatives : enable

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 sunPosition;
uniform float time;

vec3 phong(vec3 ka, vec3 kd, vec3 ks, float alpha, vec3 normal) {
    vec3 n = normalize( normal );
    vec3 s = normalize( vPosition - sunPosition );
    vec3 v = normalize( vPosition - cameraPosition );
    vec3 r = reflect( -s, n );

    vec3 ambient = ka;
    vec3 diffuse = max(0.0, dot(normalize(sunPosition), normal)) * kd;
    vec3 specular = pow(max(dot(r,v), 0.0), alpha) * ks;

    return ambient + diffuse + specular;
}

void main() {
    vec3 dX = dFdx(vPosition);
    vec3 dY = dFdy(vPosition);
    vec3 normal = normalize(cross(dX, dY));

    vec3 skyColor = vec3(0.0) + 0.2 * vec3(pow(1.0 - vUv.y, 2.0)); //vec3(0.0, 0.6 * (1.0 - vUv.y) + 0.3, 0.9)

    vec3 stars = pow(snoise3(vPosition * 40.0), 20.0) * vec3(1.1, 1.1, 1.0);
    gl_FragColor = vec4(max(0.0, dot(normalize(cameraPosition - vPosition), normal)) * skyColor + stars, 1.0);
}