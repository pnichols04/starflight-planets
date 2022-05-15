import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { StarSelector } from './components/StarSelector.js';
import { PlanetData } from './components/PlanetData.js';

// import { App } from './App.js';

import { World } from './world/World.js';
// import { SphereSectionGroup } from './SphereGroup.js';
// import { StarSelector } from './components/StarSelector.js';
// import { PlanetData } from './components/PlanetData.js';

const mainElement = document.querySelector( '#main' );
const controlsTarget = document.querySelector( '#controlsTarget' );

const world = new World( mainElement, controlsTarget, true );

const starSelector = new StarSelector( '.starSelector' );
const planetData = new PlanetData( '#planetData' );
planetData.update( starSelector.selectedPlanet );
world.showPlanet( starSelector.selectedPlanet );
starSelector.emitter.on( 'selectedPlanetChanged', ( /** @type {import('./components/Sector.js').Planet} */ planet ) => {

	planetData.update( planet );
	world.showPlanet( planet );

} );


world.start();

// const scene = App.current.scenes.get('Main');
// const sphereGeometry = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
// sphereGeometry.computeBoundingBox();
// console.log(sphereGeometry.boundingBox);
// console.log(sphereGeometry.attributes.position.length);
// Factors of 96: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96
// const loader = new THREE.TextureLoader();
// const tex = loader.load('../13.png');
// tex.wrapS = THREE.RepeatWrapping;
// tex.magFilter = THREE.NearestFilter;
// const dispTex = loader.load('../13_disp.png');

// const sphereGroup = new SphereSectionGroup(8, 1);
// scene.add(sphereGroup);
// scene.add(new THREE.AxesHelper(1.5));

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
// hemiLight.color.setHSL(0.6, 1, 0.6);
// hemiLight.groundColor.setHSL(0.095, 1, 0.75);
// hemiLight.position.set(0, 50, 0);
// scene.add(hemiLight);

// const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
// scene.add(hemiLightHelper);

// const dirLight = new THREE.DirectionalLight(0xffffff, 1);
// dirLight.color.setHSL(0.1, 1, 0.95);
// dirLight.position.set(-1, 1.75, 1);
// dirLight.position.multiplyScalar(5);
// scene.add(dirLight);

// dirLight.castShadow = true;

// dirLight.shadow.mapSize.width = 2048;
// dirLight.shadow.mapSize.height = 2048;

// const d = 50;

// dirLight.shadow.camera.left = -d;
// dirLight.shadow.camera.right = d;
// dirLight.shadow.camera.top = d;
// dirLight.shadow.camera.bottom = -d;

// dirLight.shadow.camera.far = 3500;
// dirLight.shadow.bias = -0.0001;

// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
// scene.add(dirLightHelper);

// function animate() {
//   requestAnimationFrame(animate);

//   // if (!sphereGroup.boundingSphere) {
//   // 	sphereGroup.computeBoundingSphere();
//   // }

//   // const bsphere = sphereGroup.boundingSphere.clone();
//   // bsphere.applyMatrix4(group.matrixWorld);
//   // App.current.cameras.get('Main').lookAt(bsphere.center);
//   // App.current.renderer.render(
//   //   App.current.scenes.get('Main'),
//   //   App.current.cameras.get('Main')
//   // );


// }

// animate();
