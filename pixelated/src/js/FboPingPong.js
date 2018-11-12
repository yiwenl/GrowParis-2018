// FboPingPong.js
import { FrameBuffer } from 'alfrid';

class FboPingPong {
	constructor(mWidth, mHeight, mParameters = {}) {
		const fbo0 = new FrameBuffer(mWidth, mHeight, mParameters);
		const fbo1 = new FrameBuffer(mWidth, mHeight, mParameters);

		this._fbos = [fbo0, fbo1];
	}

	swap() {
		this._fbos.reverse();
	}


	get read() {
		return this._fbos[0];
	}

	get write() {
		return this._fbos[1];
	}

	get readTexture() {
		return this._fbos[0].getTexture();
	}

	get writeTexture() {
		return this._fbos[1].getTexture();
	}
}

export default FboPingPong;