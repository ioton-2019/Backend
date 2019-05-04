const winston = require('winston')
// const morgan = require('morgan')
// app.use('combined', { stream: winston.stream })

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(info => {
        const { timestamp, level, message, ...args } = info
        const ts = timestamp.slice(0, 19).replace('T', ' ')
        return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`
      })
    )
  }))
}

module.exports = logger
