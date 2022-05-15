module.exports = {
	env: {
		es6: true,
		browser: true,
		es2021: true,
	},
	extends: [ 'mdcs' ],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'no-plusplus': [ 'error', { allowForLoopAfterthoughts: true } ],
	}
};
