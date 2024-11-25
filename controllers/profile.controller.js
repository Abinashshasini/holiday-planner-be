const bcrypt = require('bcrypt');
const { asyncHandler } = require('../utils/asyncHandler');
const { handleValidateEditProfileData } = require('../utils/validation.js');
const User = require('../models/user');
const { ApiError } = require('../utils/apiError.js');
const { ApiResponse } = require('../utils/apiResponse.js');

/** Cookie option's for setting user cookies */
const cookiesOptions = {
  httpOnly: true,
  secure: true,
};

/**
 * STEPS
 * 1. Get user details and send to frontend.
 */
const handleGetUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(404, 'User does not exist');
  }
  return res
    .status(201)
    .json(new ApiResponse(200, req.user, 'User profile fetched successfully.'));
});

/*
 * STEPS
 * 1. Get user details from req.
 * 2. Sanitise the fields and update them in dB.
 */
const handleEditUserProfile = asyncHandler(async (req, res) => {
  if (!handleValidateEditProfileData(req)) {
    throw new ApiError('Invalid Edit Request');
  }

  const loggedInUser = req.user;

  Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

  await loggedInUser.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        loggedInUser,
        `${loggedInUser.firstName} profile edited successfully.`
      )
    );
});

module.exports = {
  handleGetUserProfile,
  handleEditUserProfile,
};
