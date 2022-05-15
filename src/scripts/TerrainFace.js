import * as THREE from "three";

export class TerrainFace {
  /** @type {THREE.Vector3} */
  axisA;

  /** @type {THREE.Vector3} */
  axisB;

  /** @type {THREE.BufferGeometry} */
  geometry;

  /** @type {THREE.Vector3} */
  localUp;

  /** @type {number} */
  resolution;

  /**
   *
   * @param {THREE.BufferGeometry} geometry
   * @param {THREE.Vector3} localUp
   * @param {number} resolution
   */
  constructor(geometry, localUp, resolution) {
    this.geometry = geometry;
    this.localUp = localUp;
    this.resolution = resolution;

    this.axisA = new THREE.Vector3(localUp.y, localUp.z, localUp.x);
    this.axisB = localUp.clone().cross(this.axisA);
  }
}
