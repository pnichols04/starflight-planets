/**
 * @typedef {Object} Planet
 * @property {number} systemX
 * @property {number} systemY
 * @property {number} systemKey
 * @property {number} orbitSequence
 * @property {number} orbitPosition
 * @property {string} starClass
 * @property {number} mass
 * @property {number} biodensity
 * @property {number} mineralDensity
 * @property {Array<string>} atmosphere
 * @property {string} atmosphereDensity
 * @property {Array<string>} hydrosphere
 * @property {Array<string>} lithosphere
 * @property {string} surface
 * @property {number} gravity
 * @property {Array<string>} temperature
 * @property {string} weather
 * @property {number} imageIndex
 * @property {string} notes
 * @property {Array<number>} topoColors
 * @property {number} radius
 *
 * @typedef {Object} Star
 * @property {number} systemX
 * @property {number} systemY
 * @property {number} systemKey
 * @property {number} planetCount
 * @property {string} orbitMask
 * @property {number} flareDate
 * @property {number} mass
 * @property {number} exponent
 * @property {number} oldSolMass
 * @property {number} gravity
 * @property {string} class
 * @property {number} cluster
 * @property {Array<Planet>} planets
 */

/** @type {Array<Star>} */
import stars from '../../data/systems_planets.json';

class Sector {

	constructor() {

		/** @type {Array<Star>} */
		this.stars = stars.sort( ( a, b ) => a.systemKey - b.systemKey );

	}

	/**
   *
   * @param {number} systemKey
   * @return {Star}
   */
	getStar( systemKey ) {

		return this.stars.find( s => s.systemKey === systemKey );

	}

}

export { Sector };
