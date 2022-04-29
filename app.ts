/**
 *  Express-Typescript Template.
 *  Server Entry.
 *
 *  @author LancerComet
 *  @license MIT
 */

import 'dotenv/config'

import * as http from 'http'
import * as path from 'path'

import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'

import { router } from './routes'
import { staticServing } from './build'
import { GlobalEnv } from './env'

(async () => {
  const app = express()

  // Initialize Express.
  const host = GlobalEnv.host
  const port = GlobalEnv.port

  if (!host || !port || isNaN(port)) {
    console.error('Please specific a host and a port.')
    process.exit(1)
  }

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'jade')
  app.set('port', port)

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use('/', express.static(path.resolve(__dirname, './public')))

  // Init Static Files Serving.
  staticServing(app)

  // Initialize Router.
  router(app)

  // Start Server.
  const server = http.createServer(app)
  server.listen(port, host)

  server.on('error', error => {
    console.error(`[Error] Server startup failed: ${error}`)
    process.exit(1)
  })

  server.on('listening', () => {
    console.log(`Server is going to start at ${host}:${port}...`)
  })
})()
