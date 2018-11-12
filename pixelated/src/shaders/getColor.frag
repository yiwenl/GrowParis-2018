// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texturePos;
uniform sampler2D textureBg;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
	vec3 pos = texture2D(texturePos, vTextureCoord).xyz;
	vec4 screenPos = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);	
	vec2 screenUV = screenPos.xy / screenPos.w * .5 + .5;

    gl_FragColor = vec4(screenUV, 1.0, 1.0);
    gl_FragColor = texture2D(textureBg, screenUV);
}