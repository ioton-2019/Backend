const express = require('express')
const apiV1 = express.Router()

const owners = require('./routes/owners')

apiV1.use('/owners', owners)

module.exports = apiV1
