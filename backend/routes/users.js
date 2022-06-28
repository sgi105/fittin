var express = require('express')
var router = express.Router()
const {
  createUser,
  getUser,
  updateUser,
  logWeight,
  runUtil,
} = require('../controllers/userController.js')

router.post('/', createUser)
router.get('/runutil', runUtil)
router.get('/:phoneNumber', getUser)
router.put('/', updateUser)
router.post('/log', logWeight)

module.exports = router
