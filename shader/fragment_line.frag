void main() {
  float dist = length(gl_PointCoord - vec2(.5));
  float disc = 1. - step(.5, dist);
  if (disc == 0.) discard;
  gl_FragColor = vec4(1.);
}