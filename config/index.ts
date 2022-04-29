import * as path from 'path'

const isProd = process.env.NODE_ENV === 'production'

export default {
  appInfo: {
    name: 'Express-Typescript',
    author: 'LancerComet'
  },

  server: {
    host: '127.0.0.1',
    port: 3000,
    publicFolder: path.resolve(__dirname, '../public')
  }
}
