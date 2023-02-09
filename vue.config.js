const isStaging = !!process.env.VUE_APP_STAGINE
const isProduction = process.env.NODE_ENV === 'production'

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
    }
}