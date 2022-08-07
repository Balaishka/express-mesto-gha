const router = require('express').Router();
const {
  getUsers,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

// router.get('/:userId', getUser);

router.get('/me', getUserInfo);

router.patch('/me', updateUserInfo);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
