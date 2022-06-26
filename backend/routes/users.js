var express = require('express')
var router = express.Router()
const {
  createUser,
  getUser,
  updateUser,
  logWeight,
} = require('../controllers/userController.js')

router.post('/', createUser)
router.get('/:phoneNumber', getUser)
router.put('/', updateUser)
router.post('/log', logWeight)

module.exports = router
