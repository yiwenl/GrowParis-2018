// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import Settings from './Settings';
import Config from './Config';

import ViewTunnel from './ViewTunnel';
import PassBloom from './PassBloom';

class SceneApp extends Scene {
	constructor() {
		Settings.init();

		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = Math.PI/4;
		this.orbitalControl.ry.value = Math.PI/4;
		this.orbitalControl.radius.value = 5;

		this._step = 0;
		window.addEventListener('keydown', (e)=> {
			console.log(e.keyCode);
			if(e.keyCode === 32 || e.keyCode === 39) {
				this._step ++;
			} else if(e.keyCode === 37) {
				this._step --;
				if(this._step < 0) this._step = 0;
			}
		})
	}

	_initTextures() {
		console.log('init textures');


		const oRender = {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR,
			type:GL.FLOAT
		};

		this._fboRender = new alfrid.FrameBuffer(GL.width, GL.height, oRender);
	}


	_initViews() {
		console.log('init views');

		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bCopy = new alfrid.BatchCopy();

		this._passBloom = new PassBloom(5);
		this._vTunnel = new ViewTunnel();
	}


	render() {
		GL.clear(0, 0, 0, 0);
		this._vTunnel.speed = this._step < 3 ? 0 : 1;

		// this._bAxis.draw();
		// this._bDots.draw();
		this._fboRender.bind();
		GL.clear(0, 0, 0, 0);
		this.toRender();
		this._fboRender.unbind();


		this._passBloom.render(this._fboRender.getTexture());

		this.toRender();


		if(this._step >= 3) {
			GL.enableAdditiveBlending();
			this._bCopy.draw(this._passBloom.getTexture());
			GL.enableAlphaBlending();	
		}
	}

	toRender() {
		if(this._step <= 5) {
			this._bAxis.draw();
			
		}

		this._bDots.draw();	
		

		if(this._step === 0) {
			this._vTunnel.render(true);	
		} else if(this._step === 1) {
			this._vTunnel.render(true, true);
		} else if(this._step === 2) {
			this._vTunnel.render(false, true);	
		} else if(this._step === 3) {
			this._vTunnel.render(false, true);	
		} else if(this._step === 4) {
			this._vTunnel.render(false, true);	
			this._vTunnel.renderTransparent(.25);
		} else if(this._step === 5) {
			this._vTunnel.renderTransparent(.25);
			this._vTunnel.render(false, true);	
		} else {
			this._vTunnel.renderTransparent(0);
			this._vTunnel.render(false, true);	
		}
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;