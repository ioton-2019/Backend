const express = require('express')
const apiV1 = express.Router()

const owners = require('./routes/owners')
const lamps = require('./routes/lamps')
const pets = require('./routes/pets')

apiV1.use('/owners', owners)
apiV1.use('/lamps', lamps)
apiV1.use('/pets', pets)

module.exports = apiV1
