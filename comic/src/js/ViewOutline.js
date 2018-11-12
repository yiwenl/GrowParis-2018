// ViewOutline.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import Config from './Config';
import vs from 'shaders/line.vert';
import fs from 'shaders/diffuse.frag';

class ViewOutline extends alfrid.View {
	
	constructor() {
		super(vs, alfrid.ShaderLibs.simpleColorFrag);
		this.shaderDiffuse = new alfrid.GLShader(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('model');
	}


	render(mDrawFront=false) {
		GL.gl.cullFace(GL.gl.FRONT);

		this.shader.bind();
		this.shader.uniform("color", "vec3", [0, 0, 0]);
		this.shader.uniform("opacity", "float", 1);
		this.shader.uniform("uOutlineWidth", "float", Config.outlineWidth);

		GL.draw(this.mesh);

		GL.gl.cullFace(GL.gl.BACK);

		if(mDrawFront) {
			this.shaderDiffuse.bind();
			this.shaderDiffuse.uniform("uOutlineWidth", "float", 0);
			GL.draw(this.mesh);
		}
	}


	renderDiffuse(mCullback=false, mExtrude=0) {
		if(mCullback) {
			GL.gl.cullFace(GL.gl.FRONT);
		}
		this.shaderDiffuse.bind();
		this.shaderDiffuse.uniform("uOutlineWidth", "float", Config.outlineWidth * mExtrude);
		GL.draw(this.mesh);
		if(mCullback) {
			GL.gl.cullFace(GL.gl.BACK);
		}
	}


}

export default ViewOutline;