import { viewport } from '@popperjs/core';

/**
 * Responds to resize events
 * @param {HTMLElement} container
 * @param {HTMLElement} viewPortal
 * @param {import('three').PerspectiveCamera} camera
 * @param {import('three').WebGLRenderer} renderer
 */
const setSize = ( container, viewPortal, camera, renderer ) => {

	viewPortal.style.height = `${container.offsetHeight - viewPortal.offsetTop}px`;
	const portalRect = viewPortal.getBoundingClientRect();
	const portalCenter = [
		portalRect.left + portalRect.width / 2,
		portalRect.top + portalRect.height / 2
	];
	const containerRect = container.getBoundingClientRect();
	const containerCenter = [
		containerRect.left + containerRect.width / 2,
		containerRect.top + containerRect.height / 2
	];
	const width = container.clientWidth;
	const height = container.clientHeight;

	camera.aspect = width / width;
	camera.setViewOffset(
		width,
		height,
		containerCenter[ 0 ] - portalCenter[ 0 ],
		containerCenter[ 1 ] - portalCenter[ 1 ],
		width,
		height
	);
	camera.updateProjectionMatrix();

	renderer.setSize( container.clientWidth, container.clientHeight );
	renderer.setPixelRatio( window.devicePixelRatio );

};

class Resizer {

	/**
   * Initializes a new Resizer instance.
   * @param {HTMLElement} container
	 * @param {HTMLElement} viewPortal
   * @param {import('three').PerspectiveCamera} camera
   * @param {import('three').WebGLRenderer} renderer
   */
	constructor( container, viewPortal, camera, renderer ) {

		setSize( container, viewPortal, camera, renderer );

		window.addEventListener( 'resize', () => {

			setSize( container, viewPortal, camera, renderer );

		} );

	}

}

export { Resizer };
