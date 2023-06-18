const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/api",
    "/admins",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: process.env.REACT_APP_WE_SERVIN,
        secure: false
    });

    app.use(appProxy);
};
