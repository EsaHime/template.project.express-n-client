import { Application } from 'express'
import { getTemplate } from '../modules/template'

const initControllers = (app: Application) => {
  app.get('/', (req, res, next) => {
    res.send(getTemplate('index'))
  })

  app.get('/about', (req, res, next) => {
    res.send(getTemplate('about'))
  })
}

export {
  initControllers
}
