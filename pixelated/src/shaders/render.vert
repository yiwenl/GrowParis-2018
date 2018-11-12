// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D texturePos;
uniform sampler2D textureColor;
uniform vec2 uViewport;
uniform float uStep;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

const float radius = 0.002;

void main(void) {
	vec2 uv = aVertexPosition.xy;

	vec3 pos = texture2D(texturePos, uv).xyz;
	vec3 color = texture2D(textureColor, uv).rgb;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
    vColor = color;

    if(uStep < 2.0) {
    	vColor = vec3(1.0);
    } else if(uStep < 3.0) {
    	vec2 uv = gl_Position.xy / gl_Position.w * .5 + .5;
    	vColor = vec3(uv, 0.0);
    }  

    float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset * (1.0 + aVertexPosition.z);
}