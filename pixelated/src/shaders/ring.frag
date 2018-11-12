
precision highp float;
varying vec2 vTextureCoord;
uniform float uOffset;


float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

void main(void) {

	float inner = 0.6 * cubicOut(uOffset);
	float outer = 0.95 * exponentialOut(uOffset);

	float dist = distance(vTextureCoord, vec2(.5)) / 0.5;

	const float r = 0.025;
	float _in = smoothstep(inner-r, inner, dist);
	float _out = smoothstep(outer+r, outer, dist);

	float g = _in + _out - 1.0;

    gl_FragColor = vec4(vec3(1.0), g);
}