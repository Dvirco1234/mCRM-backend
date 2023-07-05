const express = require('express')
const { getDatalists } = require('./table.controller')
const router = express.Router()

router.get('/', getDatalists)

module.exports = router