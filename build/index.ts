import * as path from 'path'
import { Express } from 'express'
import * as webpack from 'webpack'
import * as devMiddleware from 'webpack-dev-middleware'
import * as hotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './webpack.conf'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Initialize static files serving.
 * Serve static files from server directly.
 *
 * @param app
 */
export default function (app: Express) {
  const compiler = webpack(webpackConfig)

  const devMW = devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })

  const hotMW = hotMiddleware(compiler)

  if (isDev) {
    // Hot reload funciton.
    compiler.plugin('compilation', function (compilation) {
      compilation.plugin('html-webpack-plugin-after-emit', function (data, callback) {
        hotMW.publish({ action: 'reload' })
        callback()
      })
    })

    // Update templates.
    compiler.plugin('done', () => {
      const fs = devMW.fileSystem
      const tplFiles = fs.readdirSync(path.join(webpackConfig.output.path, './templates'))
      tplFiles.forEach(tplName => {
        const tplPath = path.join(webpackConfig.output.path, './templates/' + tplName)
        global['templates'][tplName.replace('.html', '')] = fs.readFileSync(tplPath).toString()
      })
    })
  }

  app.use(devMW)
  app.use(hotMW)
}
