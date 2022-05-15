import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls( camera, domElement ) {

	const controls = new OrbitControls( camera, domElement );
	return controls;

}

export { createControls };
