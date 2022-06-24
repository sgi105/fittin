var express = require('express')
var router = express.Router()
const {
  createUser,
  getUser,
  updateUser,
} = require('../controllers/userController.js')

router.post('/', createUser)
router.get('/:phoneNumber', getUser)
router.put('/', updateUser)

module.exports = router
