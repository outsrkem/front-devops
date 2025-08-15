const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    publicPath: "/devops/",
    transpileDependencies: true,
    devServer: {
        proxy: {
            "/": {
                target: "https://uias.localvm.outsrkem.top:30078/",
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    "^/uias": "/uias",
                },
            },
        },
        webSocketServer: false,
    },
    configureWebpack: {
        performance: {
            hints: "warning",
            maxEntrypointSize: 200000,
            maxAssetSize: 200000,
        },
    },
});
