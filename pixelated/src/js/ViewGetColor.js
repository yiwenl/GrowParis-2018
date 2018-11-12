// ViewGetColor.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';
import fs from 'shaders/getColor.frag';

class ViewGetColor extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		const {numParticles:num} = Config;

		const positions = [];
		const indices = [];
		let count = 0;

		for(let i=0; i<num; i++) {
			for(let j=0; j<num; j++) {
				let u = i/num;
				let v = j/num;
				positions.push([u, v, Math.random()]);
				indices.push(count);
				count ++;
			}
		}

		// this.mesh = new alfrid.Mesh(GL.POINTS);
		// this.mesh.bufferVertex(positions);
		// this.mesh.bufferIndex(indices);

		this.mesh = alfrid.Geom.bigTriangle();
	}


	render(texturePos, textureBg) {
		this.shader.bind();
		this.shader.uniform("texturePos", "uniform1i", 0);
		texturePos.bind(0);
		this.shader.uniform("textureBg", "uniform1i", 1);
		textureBg.bind(1);
		GL.draw(this.mesh);
	}


}

export default ViewGetColor;