const HtmlWebpackPlugin = require('html-webpack-plugin')
const { format } = require('prettier')
// const fs = require('fs-extra')
const { writeFile } = require('fs/promises')
const path = require('path')
/**
 * 清单配置列表导入index.html，并区分环境
 */
class ManifestScriptWebpackPlugin {
  /**
   * 获取清单配置列表
   */
  constructor(options) {
    this.defaultOptions = options || {}
  }
  apply(compiler) {
    const output = compiler.options.output.path
    const userOptions = this.defaultOptions
    const defaultOptions = {
      filename: 'manifest',
      manifest: {},
      format: true
    }
    const options = Object.assign(defaultOptions, userOptions)
    compiler.hooks.compilation.tap(
      'ManifestScriptWebpackPlugin',
      (compilation) => {
        HtmlWebpackPlugin.getHooks(
          compilation
        ).beforeAssetTagGeneration.tapAsync(
          'ManifestScriptWebpackPlugin',
          (data, cb) => {
            /** 添加manifest文件到body */
            data.assets.js.push(`${options.filename}.js`)

            cb(null, data)
          }
        )
      }
    )
    compiler.hooks.afterEmit.tapAsync(
      'ManifestScriptWebpackPlugin',
      (compilation, callback) => {
        const formatCode = (code, parser = 'typescript') => {
          return format(code, {
            parser,
            singleQuote: true
          })
        }
        const manifest = `window.${options.filename} = ${JSON.stringify(
          options.manifest
        )}`
        const code = options.format ? formatCode(manifest) : manifest
        writeFile(`${output}\\${options.filename}.js`, code, 'utf-8')
        callback()
      }
    )
  }
}

module.exports = ManifestScriptWebpackPlugin
