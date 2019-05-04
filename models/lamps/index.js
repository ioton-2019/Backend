/* globals requireWrapper */

/** This module defines the mongoose schema for an lamp
 *
 * @author Arne Rolf
 *
 * @module models/lamps/index.js
 * @type {mongoose schema}
 */

const mongoose = require('mongoose')
const logger = requireWrapper('helpers/logger')

const Schema = mongoose.Schema
const LampSchema = new Schema(
  {
    name: { type: String, required: true },
    pets: { type: Array, required: true },
    emailAddress: { type: String },
    homeAddress: {
      street: { type: String },
      postalCode: { type: Number },
      addition: { type: String }
    }
  },
  {
    _id: true,
    collection: 'Lamps',
    timestamps: true
  }
)

const mongooseOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  socketTimeoutMS: 0,
  keepAlive: true,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
}

let connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/Lamps`

if (process.env.DB_USER && process.env.DB_PASS) {
  connectionString = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/Lamps?authSource=admin`
}

mongoose.Promise = global.Promise

logger.info('MongoDB: trying initial connection')

const db = mongoose.createConnection()

db.on('error', e => logger.error(`MongoDB: ${e}`))
db.on('connected', e => logger.info(`MongoDB: is connected`))
db.on('disconnecting', () => logger.warn('MongoDB: is disconnecting!'))
db.on('disconnected', () => logger.warn('MongoDB: is disconnected!'))
db.on('reconnected', () => logger.info(`MongoDB: is reconnected`))
db.on('timeout', e => logger.warn(`MongoDB: timeout ${e})`))
db.on('close', () => logger.warn('MongoDB: connection closed'))

db.openUri(connectionString, mongooseOptions)

module.exports = db.model('Lamps', LampSchema)
