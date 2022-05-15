const systemsPlanets = require( "./src/data/systems_planets.json" );

module.exports = {
	locals: {
		systemsPlanets: systemsPlanets.sort((a, b) => a.systemKey - b.systemKey),
	}
};
