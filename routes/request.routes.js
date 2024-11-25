const { Router } = require('express');
const { handleLikeOrPass } = require('../controllers/request.controller.js');
const { handleValidateAuthenticateUser } = require('../middlewares/auth.js');

const router = Router();

/** Declaring user routes */
router
  .route('/send/:status/:toUserId')
  .post(handleValidateAuthenticateUser, handleLikeOrPass);

module.exports = router;
