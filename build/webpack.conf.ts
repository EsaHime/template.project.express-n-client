import * as fs from 'fs'
import * as path from 'path'
import * as autoprefixer from 'autoprefixer'
import * as webpack from 'webpack'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as OptimizeJsPlugin from 'optimize-js-plugin'

const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

const config = {
  entry: {
    // Index.
    index: resolve('../views/index/index.ts'),

    // About.
    about: resolve('../views/about/index.ts')
  },

  // eval-source-map is faster for development
  devtool: isProd ? '#source-map' : '#eval-source-map',

  output: {
    path: path.resolve(__dirname, '../static'),
    filename: 'static/scripts/[name].[hash].js',
    chunkFilename: 'static/scripts/[id].[chunkhash].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['', '.js', '.ts', '.tsx', '.json'],
    fallback: [path.join(__dirname, '../node_modules')]
  },

  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 5000,
          name: 'static/assets/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 5000,
          name: 'static/assets/[name].[hash:7].[ext]'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: isProd ? 'production' : 'development'
      })
    }),

    new webpack.optimize.OccurrenceOrderPlugin()
  ],

  watch: !isProd,

  postcss: [autoprefixer({ browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', 'ie 9'] })]
}

// Production setup.
if (isProd) {
  // CSS Extracting.
  config.plugins.push(new ExtractTextPlugin('static/css/[name].[contenthash].css')),

  // Uglify.
  config.plugins.push(new webpack.optimize.UglifyJsPlugin()),

  // Vendor.
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module, count) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(__dirname, '../node_modules')
        ) === 0
      )
    }
  }),

  // extract webpack runtime and module manifest to its own file in order to
  // prevent vendor hash from being updated whenever app bundle is updated
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['vendor']
  })
} else {
  // Development setup.
  Object.keys(config.entry).forEach(entryName => {
    config.entry[entryName] = [resolve('./dev-client.ts')].concat(config.entry[entryName])
  })

  // Hot Module Replacement.
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

// Define HTML configuration by reading dir "views".
const blackList = ['assets']
const viewPath = path.resolve(__dirname, '../views')
const views = fs.readdirSync(viewPath)
views.forEach(dirName => {
  if (blackList.indexOf(dirName) > -1) { return }

  const tplPath = viewPath + `/${dirName}/index.jade`

  if (fs.existsSync(tplPath)) {
    config.plugins.push(new HtmlWebpackPlugin({
      filename: `templates/${dirName}.html`,
      template: tplPath,
      inject: false
    }))
  }
})

// Define HTML configuration manually.

// Index Page.
// config.plugins.push(
//   new HtmlWebpackPlugin({
//     filename: 'templates/index.html',
//     template: resolve('../views/index/index.jade'),
//     inject: false
//   })
// )

// // About Page.
// config.plugins.push(
//   new HtmlWebpackPlugin({
//     filename: 'templates/about.html',
//     template: resolve('../views/about/index.jade'),
//     inject: false
//   })
// )

// Optimize JS.
config.plugins.push(
  new OptimizeJsPlugin({
    sourceMap: false
  })
)

export default config
