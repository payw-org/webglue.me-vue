const express = require('express')
const app = express()
const frameguard = require('frameguard')
const router = require('./router')

app.use(router)
app.use(frameguard())

module.exports = {
  path: '/api',
  handler: app
}
