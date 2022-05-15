import { WebGLRenderer } from 'three';

/**
 *
 * @param {HTMLElement} container
 * @returns {import('three').WebGLRenderer}
 */
function createRenderer() {

	/** @type {import('three').WebGLRendererParameters} */
	const params = {
		antialias: true,
	};

	const renderer = new WebGLRenderer( params );
	renderer.physicallyCorrectLights = true;
	return renderer;

}

export { createRenderer };
