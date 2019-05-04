require('dotenv').config()
const port = process.env.PORT || 8081

module.exports.baseURL = `http://localhost:${port}/api/v1`

module.exports.codes = {
  success: 200,
  created: 201,
  nocontent: 204,
  wrongrequest: 400,
  notfound: 404,
  wrongmethod: 405,
  cannotfulfill: 406,
  wrongmedia: 415
}
