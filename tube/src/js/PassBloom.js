// PassBloom.js

import alfrid, { GL } from 'alfrid';
import fsTreshold from '../shaders/threshold.frag';
import fsBloom from '../shaders/bloom.frag';
import fsCompose from '../shaders/bloomCompose.frag';

const getNearestScaleOf2 = (mValue) => {
	let i = 0;
	let size = 0;
	do {
		size = Math.pow(2, i)
		i ++;
	} while(size < mValue);

	return size;
}

class PassBloom {

	constructor(mNumMips = 5, mStartingScale = 0.5) {
		this._numMips = Math.min(mNumMips, 5);
		this._startingScale = mStartingScale;
		this._initTextures();
		this._initViews();
	}


	_initTextures(){
		// let width = Math.round(GL.width*this._startingScale);
		// let height = Math.round(GL.height*this._startingScale);

		let width = getNearestScaleOf2(GL.width*this._startingScale);
		let height = getNearestScaleOf2(GL.height*this._startingScale);

		console.log(width, height);

		this._fbos = [];
		for(let i=0; i<this._numMips; i++) {
			const fboV = new alfrid.FrameBuffer(width, height);
			const fboH = new alfrid.FrameBuffer(width, height);
			this._fbos.push({fboV, fboH});

			width = Math.round(width/2);
			height = Math.round(height/2);
		}

		// const scale = 0.5;
		// this._fboThreshold = new alfrid.FrameBuffer(GL.width * scale, GL.height * scale);
		// this._fboCompose = new alfrid.FrameBuffer(GL.width * scale, GL.height * scale);

		// const oSettings = {
		// 	minFilter:GL.NEAREST_MIPMAP_LINEAR,
		// 	magFilter:GL.NEAREST_MIPMAP_LINEAR,
		// }

		const oSettings = {
			// minFilter:GL.LINEAR_MIPMAP_NEAREST,
			minFilter:GL.LINEAR,
			// minFilter:GL.LINEAR,
			magFilter:GL.LINEAR,
		}

		window.GL = GL;

		const s = 512;
		this._fboThreshold = new alfrid.FrameBuffer(s, s, oSettings);
		this._fboCompose = new alfrid.FrameBuffer(s, s, oSettings);
	}

	_initViews() {
		//	mesh
		this.mesh = alfrid.Geom.bigTriangle();

		const vsTri = alfrid.ShaderLibs.bigTriangleVert;

		// 	shaders - threshold
		this.shaderThreshold = new alfrid.GLShader(vsTri, fsTreshold);
		this.uniformsThreshold = {
			luminosityThreshold:0.6,
			smoothWidth:0.01,
			defaultOpacity:0,
			defaultColor:[0, 0, 0]
		}

		this.shaderThreshold.bind();
		this.shaderThreshold.uniform("texture", "uniform1i", 0);
		this.shaderThreshold.uniform(this.uniformsThreshold);

		//	shaders - mip bloom
		const kernelSizeArray = [3, 5, 7, 9, 11];
		let width = Math.round(GL.width*this._startingScale);
		let height = Math.round(GL.height*this._startingScale);

		this._shadersBloom = [];
		for(let i=0; i<this._numMips; i++) {
			let kernelSize = kernelSizeArray[i];
			let fs = fsBloom.replace(/\${kernelRadius}/g, kernelSize);
			const shader = new alfrid.GLShader(vsTri, fs);
			shader.bind();
			shader.uniform("texSize", "vec2", [width, height]);
			this._shadersBloom.push(shader);

			width = Math.round(width/2);
			height = Math.round(height/2);
		}

		//	shader - compose

		this.uniformsCompose = {
			bloomStrength:1.,
			bloomRadius:0.4
		}

		let fs = fsCompose.replace(/\${NUM_MIPS}/g, this._numMips);

		let strBloom = '';
		for(let i=0; i<this._numMips; i++) {
			strBloom += `\tcolor += lerpBloomFactor(bloomTintColors[${i}].a) * vec4(bloomTintColors[${i}].rgb, 1.0) * texture2D(blurTexture${i+1}, vTextureCoord);`;
		}

		fs = fs.replace(/\${BLOOMS}/g, strBloom);

		let tintColor = [];
		this.shaderCompose = new alfrid.GLShader(vsTri, fs);
		this.shaderCompose.bind();
		for(let i=0; i<this._numMips; i++) {
			this.shaderCompose.uniform(`blurTexture${i+1}`, "uniform1i", i);
			tintColor = tintColor.concat([1, 1, 1, 1.0-0.2*i]);
		}

		this.shaderCompose.uniform('bloomTintColors', 'vec4', tintColor);
		this.shaderCompose.uniform(this.uniformsCompose);
	}

	render(texture) {
		this._fboThreshold.bind();
		GL.clear(0, 0, 0, 0);
		this.shaderThreshold.bind();
		
		this.shaderThreshold.uniform(this.uniformsThreshold);
		texture.bind(0);
		GL.draw(this.mesh);
		this._fboThreshold.unbind();

		let inputTexture = this._fboThreshold.getTexture();

		for(let i=0; i<this._numMips; i++) {
			const {fboV, fboH} = this._fbos[i];
			const shader = this._shadersBloom[i];

			shader.bind();
			shader.uniform("texture", "uniform1i", 0);

			//	bloom V
			fboV.bind();
			GL.clear(0, 0, 0, 0);
			shader.uniform("direction", "vec2", [0, 1]);
			inputTexture.bind(0);
			GL.draw(this.mesh);
			fboV.unbind();

			//	bloom H
			fboH.bind();
			GL.clear(0, 0, 0, 0);
			shader.uniform("direction", "vec2", [1, 0]);
			fboV.getTexture().bind(0);
			GL.draw(this.mesh);
			fboH.unbind();

			inputTexture = fboH.getTexture();
		}

		this._fboCompose.bind();
		GL.clear(0, 0, 0, 0);
		this.shaderCompose.bind();
		for(let i=0; i<this._numMips; i++) {
			const { fboH } = this._fbos[i];
			fboH.getTexture().bind(i);
		}
		this.shaderCompose.uniform(this.uniformsCompose);
		GL.draw(this.mesh);
		this._fboCompose.unbind();
	}

	get fbos() {
		return this._fbos;
	}

	getTexture() {
		return this._fboCompose.getTexture();
	}

	resize() {
		
	}
}

export default PassBloom;