const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const isStaging = !!process.env.VUE_APP_STAGINE
const isProduction = process.env.NODE_ENV === 'production'
const isAnalyzeMode = !!process.env.ANALYZE_MODE

module.exports ={
    // 生产环境要使用 OSS 地址
    // 其他环境都使用绝对路径
    publicPath: (isProduction && !isStaging) ? 'https://oss.keep-lego.com/editor' : '/',
    css: {
        loaderOptions: {
          less: {
            lessOptions: {
              modifyVars: {
                'primary-color': '#3E7FFF',
              },
              javascriptEnabled: true
            }
          }
        }
    },
    configureWebpack: config => {
        // 忽略 ant-design-vue组件 moment.js里面的国际化
        config.plugins.push(
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            })
        )
        if(isAnalyzeMode){
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static'
                })
            )
        }
    }
}