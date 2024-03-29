var express = require('express')
var router = express.Router()
const {
  createUser,
  getUser,
  updateUser,
  logWeight,
  runUtil,
  getTotalHabitScoreBoard,
  autoUpdateHabits,
  setGroupToUsers,
  getGroupRanking,
} = require('../controllers/userController.js')

router.post('/', createUser)
router.get('/runutil', runUtil)
router.get('/autoupdatehabits/:UTCHour', autoUpdateHabits)
router.post('/userdata', getUser)
router.put('/', updateUser)
router.post('/log', logWeight)
router.get('/totalhabitscoreboard', getTotalHabitScoreBoard)
router.put('/setgroup', setGroupToUsers)
router.get('/groupscore', getGroupRanking)

module.exports = router
