// ViewPixels.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/pixels.vert';
import fs from 'shaders/pixels.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewPixels extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const num = 256 * 256;

		const positions = [];
		const extra = [];
		const indices = [];
		let r = .5;

		for(let i=0; i<num; i++) {
			positions.push([random(-r, r), random(-r, r), random(-r, r)]);
			extra.push([Math.random(), Math.random(), Math.random()]);
			indices.push(i);
		}

		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferNormal(extra);
		this.mesh.bufferIndex(indices);
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uViewport", "vec2", [GL.width, GL.height]);
		GL.draw(this.mesh);
	}


}

export default ViewPixels;