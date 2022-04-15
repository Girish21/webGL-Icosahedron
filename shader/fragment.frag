uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;

void main() {
  vec3 X = dFdx(vPosition);
  vec3 Y = dFdy(vPosition);
  vec3 n = normalize(cross(X, Y));
  float diff = dot(n, normalize(vec3(-1., 1., 1.)));
  diff = diff * diff;
  gl_FragColor = vec4(n * diff, 1.);
}
