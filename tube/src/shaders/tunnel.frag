// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D texture;
uniform float uUseColor;
uniform float uTime;
varying float vDepthOffset;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


#define LIGHT vec3(1.0)


void main(void) {
	float d = diffuse(vNormal, LIGHT);
	d = mix(d, 1.0, .5);
	vec4 color = vec4(vec3(d), 1.0);


	vec2 uv = vTextureCoord;
	uv.y = mod(uv.y - uTime, 1.0);
	uv.x = mod(uv.x + vTextureCoord.y * uTime * 0.01, 1.0);
	vec4 colorTexture = texture2D(texture, uv);
	colorTexture.rgb *= smoothstep(0.1, 0.5, vDepthOffset);
    gl_FragColor = mix(colorTexture, color, uUseColor);
}