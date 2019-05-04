/* globals requireWrapper */

/** This module defines the mongoose schema for an owner
 *
 * @author Arne Rolf
 *
 * @module models/owners/index.js
 * @type {mongoose schema}
 */

const mongoose = require('mongoose')
const logger = requireWrapper('helpers/logger')

const Schema = mongoose.Schema
const OwnerSchema = new Schema(
  {
    name: { type: String, required: true },
    pets: { type: Array, required: true },
    emailAddress: { type: String },
    homeAddress: {
      country: { type: String, default: '' },
      city: { type: String, default: '' },
      street: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      addition: { type: String, default: '' }
    }
  },
  {
    _id: true,
    collection: 'Owners',
    timestamps: false
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

let connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/IoThon`

if (process.env.DB_USER && process.env.DB_PASS) {
  connectionString = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/IoThon?authSource=admin`
}

mongoose.Promise = global.Promise

// logger.info('MongoDB: trying initial connection')

const db = mongoose.createConnection()

db.on('error', e => logger.error(`MongoDB: ${e}`))
db.on('connected', e => logger.info(`MongoDB: is connected to collection owners`))
db.on('disconnecting', () => logger.warn('MongoDB: is disconnecting!'))
db.on('disconnected', () => logger.warn('MongoDB: is disconnected!'))
db.on('reconnected', () => logger.info(`MongoDB: is reconnected`))
db.on('timeout', e => logger.warn(`MongoDB: timeout ${e})`))
db.on('close', () => logger.warn('MongoDB: connection closed'))

db.openUri(connectionString, mongooseOptions)

module.exports = db.model('Owners', OwnerSchema)
