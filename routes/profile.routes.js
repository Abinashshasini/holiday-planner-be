const { Router } = require('express');
const {
  handleGetUserProfile,
  handleEditUserProfile,
} = require('../controllers/profile.controller.js');
const { handleValidateAuthenticateUser } = require('../middlewares/auth.js');

const router = Router();

/** Declaring user routes */
router
  .route('/view')
  .get(handleValidateAuthenticateUser, handleGetUserProfile);
router
  .route('/edit')
  .patch(handleValidateAuthenticateUser, handleEditUserProfile);

module.exports = router;
