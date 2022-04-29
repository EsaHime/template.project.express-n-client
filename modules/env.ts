const nodeEnv = process.env.NODE_ENV
const isDev = nodeEnv === 'development'
const isProd = nodeEnv === 'production'
const appName = process.env.APP_NAME || ''
const appAuthor = process.env.APP_AUTHOR || ''
const host = process.env.HOST as string
const port = parseInt(process.env.PORT as string) as number

const GlobalEnv = {
  isDev,
  isProd,
  appName,
  appAuthor,
  host,
  port,
  nodeEnv
}

Object.freeze(GlobalEnv)

export {
  GlobalEnv
}
