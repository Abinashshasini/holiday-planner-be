const { Router } = require('express');
const {
  handleLoginUser,
  handleSignupUser,
  handleLogoutUser,
} = require('../controllers/user.controller.js');

const router = Router();

/** Declaring user routes */
router.route('/signup').post(handleSignupUser);
router.route('/login').post(handleLoginUser);
router.route('/logout').post(handleLogoutUser);

module.exports = router;
