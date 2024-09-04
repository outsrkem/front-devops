const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    publicPath:'/uias-devops/',
    transpileDependencies: true,
    devServer: {
        proxy: {
          '/': {
            target: 'http://10.10.10.14:8080',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
              '^/uias': '/uias'
            }
          }
        }
    },
    configureWebpack: {
       //警告webpack的性能提示
      performance: {
        hints:'warning',
        //入口起点的最大体积
        maxEntrypointSize: 200000,
        //生成文件的最大体积
        maxAssetSize: 200000,
        },
    }
})
