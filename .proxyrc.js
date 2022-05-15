const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		createProxyMiddleware("/assets", {
			target: "http://localhost:1235/",
			pathRewrite: {
				"^/assets": "../assets",
			},
		})
	);
};