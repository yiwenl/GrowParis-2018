// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
	float r = 0.05;
	float dx = smoothstep(0.5, 0.5-r, abs(vTextureCoord.x - 0.5));
	float dy = smoothstep(0.5, 0.5-r, abs(vTextureCoord.y - 0.5));
	float d = dx * dy;
	d = mix(d, 1.0, .985);
    gl_FragColor = vec4(vec3(d), 1.0);
}