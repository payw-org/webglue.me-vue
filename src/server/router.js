import apiUrl from '../modules/api-url'
const express = require('express')
const Axios = require('axios').default

const router = express.Router()

router.get('/mirror', (req, response) => {
  // form: /mirror?url=
  const url = req.url
  const mirroringUrl = url.replace(/^\/mirror\?url=/, '')
  Axios({
    url: apiUrl.mirror(mirroringUrl),
    headers: {
      'user-agent': req.headers['user-agent']
    },
    method: 'get',
    withCredentials: true
  }).then(res => {
    response.send(res.data)
  })
})

module.exports = router
