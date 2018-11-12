// ViewRender.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';
import vs from 'shaders/render.vert';
import fs from 'shaders/render.frag';

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vs, fs);
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

		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndex(indices);
	}


	render(texturePos, textureColor, step) {
		this.shader.bind();
		this.shader.uniform("texturePos", "uniform1i", 0);
		texturePos.bind(0);
		this.shader.uniform("textureColor", "uniform1i", 1);
		textureColor.bind(1);
		this.shader.uniform("uViewport", "vec2", [GL.width, GL.height]);
		this.shader.uniform("uStep", "float", step);
		GL.draw(this.mesh);
	}


}

export default ViewRender;