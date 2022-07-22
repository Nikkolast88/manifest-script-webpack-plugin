const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestScriptWebpackPlugin = require('./index')
module.exports = {
  mode: 'production',
  entry: './example/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './example/index.html' }),
    new ManifestScriptWebpackPlugin({
      manifest: {
        API: '//192.168.49.91:86/iot-api', //Api请求
        IMG: '//127.0.0.1', // 图片地址
        NAME: '主应用',
        APPS: [
          // 子应用
          {
            name: '@pole-platform/business',
            entry: '//localhost:8081',
            container: '#container',
            activeRule: '/business/'
          }
        ]
      }
    })
  ]
}
