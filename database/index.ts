/**
 *  Database By LancerComet at 16:24, 2017/4/20.
 *  # Carry Your World #
 *  ---
 *  Database Module.
 */

import appConfig from '../config'
import * as mongoose from 'mongoose'

const dbConfig = appConfig.database

/**
 * Connect to database.
 *
 * @return {Promise<*>}
 */
export default function connect () {
  return new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.address}:${dbConfig.port}/${dbConfig.database}`)

    const connection = mongoose.connection

    connection.on('error', error => {
      console.error(`[Error] Conenct to database failed: ${error}.`)
      reject(error)
    })

    connection.on('open', () => {
      console.info('Database is connected.')
      resolve()
    })
  })

}
