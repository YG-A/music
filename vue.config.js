const path = require('path') // 引入path模块
function resolve (dir) {
  return path.join(__dirname, dir) // path.join(_dirname)设置绝对路径
}
module.exports = {

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(html)$/,
          exclude: /node_modules/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        }
      ]
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
    // 第一个参数：别名 第二个参数：路径
      .set('components', resolve('src/components'))
      .set('assets', resolve('src/assets'))
      .set('commonjs', resolve('src/commonjs'))
      .set('views', resolve('src/views'))
      .set('network', resolve('src/network'))
  },
  publicPath: './'
}
