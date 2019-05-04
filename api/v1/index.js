const express = require('express')
const apiV1 = express.Router()

const examples = require('./routes/examples')

apiV1.use('/examples', examples)

module.exports = apiV1
