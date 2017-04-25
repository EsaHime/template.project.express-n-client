const isProd = process.env.NODE_ENV === 'production'

export default {
  appInfo: {
    name: 'Express-Typescript',
    author: 'LancerComet'
  },

  database: {
    address: '127.0.0.1',
    port: 27017,
    database: 'my-database',
    username: '',
    password: '',
    maxRetrying: 5
  },

  server: {
    host: '127.0.0.1',
    port: 3000
  }
}
