import * as fs from 'fs'
import * as path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { GlobalEnv } from '../env'
// @ts-ignore
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'

const resolve = (file: string) => path.resolve(__dirname, file)
const isProd = GlobalEnv.isProd

const viewFolderPath = path.resolve(__dirname, '../views')
const viewFileList = fs.readdirSync(viewFolderPath)

const entry: Record<string, string> = {}

// Set entry based on views.
viewFileList.forEach((dirName: string) => {
  const scriptPath = viewFolderPath + `/${dirName}/index.ts`
  entry[dirName] = scriptPath
})

const cssLoader = {
  test: /\.css$/,
  use: [
    'css-loader',
    'postcss-loader'
  ]
}

const stylusLoader = {
  test: /\.styl$/,
  use: [
    'css-loader',
    'postcss-loader',
    'stylus-loader'
  ]
}

if (isProd) {
  cssLoader.use = [
    MiniCssExtractPlugin.loader,
    ...cssLoader.use
  ]
  stylusLoader.use = [
    MiniCssExtractPlugin.loader,
    ...stylusLoader.use
  ]
} else {
  cssLoader.use = [
    'style-loader',
    ...cssLoader.use
  ]
  stylusLoader.use = [
    'style-loader',
    ...stylusLoader.use
  ]
}

const webpackConfig: webpack.Configuration = {
  entry,

  mode: isProd ? 'production' : 'development',

  // eval-source-map is faster for development
  devtool: isProd ? undefined : 'eval-source-map',

  output: {
    path: path.resolve(__dirname, '../static'),
    filename: 'static/scripts/[name].[contenthash].js',
    chunkFilename: 'static/scripts/[id].[chunkhash].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },

  module: {
    rules: [
      cssLoader,
      stylusLoader,
      {
        test: /\.[jt]s$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'swc-loader'
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: 'static/assets/[name].[chunkhash].[ext]'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(GlobalEnv.nodeEnv)
    }),

    new FriendlyErrorsWebpackPlugin()
  ],

  watch: true,

  optimization: {
    minimize: isProd,
    minimizer: isProd
      ? [new TerserPlugin(), new CssMinimizerPlugin()]
      : []
  }
}

if (isProd) {
  webpackConfig.plugins!.push(new MiniCssExtractPlugin({
    filename: 'static/css/[name].[chunkhash].css'
  }))
} else {
  // Development setup.
  Object.keys(webpackConfig.entry!).forEach((entryName: string) => {
    (webpackConfig.entry as any)[entryName] = [resolve('./dev-client.ts')].concat((webpackConfig.entry as any)[entryName])
  })

  // Hot Module Replacement.
  webpackConfig.plugins!.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

// Define HTML configuration by reading dir "views".
viewFileList.forEach((dirName: string) => {
  const tplPath = viewFolderPath + `/${dirName}/index.pug`
  if (fs.existsSync(tplPath)) {
    webpackConfig.plugins!.push(new HtmlWebpackPlugin({
      filename: `templates/${dirName}.html`,
      template: tplPath,
      inject: true,
      chunks: [dirName]
    }))
  }
})

export {
  webpackConfig
}
