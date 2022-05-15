import { PerspectiveCamera } from 'three';

function createCamera() {

	const camera = new PerspectiveCamera(
		35, // Field of view
		1, // Aspect
		0.1, // Near clipping plane
		200 // Far clipping plane
	);

	camera.position.set( 0, 0, 100 );

	return camera;

}

export { createCamera };
