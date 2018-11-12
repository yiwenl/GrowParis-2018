// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vUV;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    gl_FragColor = vec4(1.0);
    gl_FragColor = vec4(vUV, 0.0, 1.0);
}