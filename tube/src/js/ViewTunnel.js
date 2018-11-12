// ViewTunnel.js

import alfrid, { GL } from 'alfrid';

import Assets from './Assets';
import vs from 'shaders/tunnel.vert';
import fs from 'shaders/tunnel.frag';

class ViewTunnel extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderColor = new alfrid.GLShader(vs, alfrid.ShaderLibs.simpleColorFrag);
		this.speed = 0;
		this.time = Math.random() * 0xFF;
	}


	_init() {
		const num = 24 * 3;
		const radius = 1;

		const positions = [];
		const uvs = [];
		const indices = [];
		let count = 0;

		const getPos = (i, j) => {
			let z = (j/num - 0.5) * 2.0;
			let a = i/num * Math.PI * 2;
			let x = Math.cos(a) * radius;
			let y = Math.sin(a) * radius;

			return [x, y, z];
		}

		for(let i=0; i<num; i++) {
			for(let j=0; j<num; j++) {
				positions.push(getPos(i, j));
				positions.push(getPos(i+1, j));
				positions.push(getPos(i+1, j+1));
				positions.push(getPos(i, j+1));

				uvs.push([i/num, j/num]);
				uvs.push([(i+1)/num, j/num]);
				uvs.push([(i+1)/num, (j+1)/num]);
				uvs.push([i/num, (j+1)/num]);

				indices.push(count * 4 + 0);
				indices.push(count * 4 + 1);
				indices.push(count * 4 + 2);
				indices.push(count * 4 + 0);
				indices.push(count * 4 + 2);
				indices.push(count * 4 + 3);

				count ++;
			}
			
		}


		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferIndex(indices);

		this.texture = Assets.get('color0');
	}


	render(mUseColor, mCullBack=false) {
		this.time += this.speed * 0.01;
		if(mCullBack) {
			GL.gl.cullFace(GL.gl.FRONT);
		}
		this.shader.bind();
		this.shader.uniform("uTime", "float", this.time);
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("uUseColor", "float", mUseColor ? 1 : 0);
		GL.draw(this.mesh);
		if(mCullBack) {
			GL.gl.cullFace(GL.gl.BACK);
		}
	}


	renderTransparent(mOpacity) {
		this.shaderColor.bind();
		this.shaderColor.uniform("color", "vec3", [1, 0, 0]);
		this.shaderColor.uniform("opacity", "float", mOpacity);

		GL.draw(this.mesh);
	}

}

export default ViewTunnel;