var express = require('express')
var router = express.Router()
const {
  logRun,
  createUser,
  getUser,
} = require('../controllers/userController.js')

router.post('/log', logRun)
router.post('/', createUser)
router.get('/:number', getUser)

module.exports = router
