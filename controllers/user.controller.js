const bcrypt = require('bcrypt');
const validator = require('validator');
const { asyncHandler } = require('../utils/asyncHandler');
const { handleValidateSignupData } = require('../utils/validation.js');
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
 * 1. Get user details from frontend.
 * 2. Validate fields -  not empty.
 * 3. Check if user exists: email, username.
 * 4. Create user object -  create entry in dB.
 * 5. Remove password and refresh token filed from response.
 * 6. Check user creation and return response.
 */
const handleSignupUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  handleValidateSignupData(req);

  const passwordHash = await bcrypt.hash(password, 10);

  const isExistedUser = await User.findOne({
    emailId,
  });

  if (isExistedUser) {
    throw new ApiError(409, 'User allredy exists');
  }

  const user = await User.create({
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    emailId,
    password: passwordHash,
  });

  const createdUser = await User.findById(user?._id).select('-password');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'));
});

/*
 * STEPS
 * 1. Get user details from frontend.
 * 2. Check if the username or email exists in the req.body.
 * 3. Find user in the dB.
 * 4. Match user password in the dB.
 * 5. Generate access token and refresh token.
 * 6. Remove password and refresh token from loggedin user (This can be solved by another dB call or updating the existing user)
 * 6. Set secure cookies and user info to frontend.
 */
const handleLoginUser = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !validator.isEmail(emailId)) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne({ emailId: emailId });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(404, 'Invalid user credentials');
  }

  const token = await user.getJWT();

  const loggedInUser = await User.findOne(user._id).select('-password');

  return res
    .status(200)
    .cookie('token', token, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          token: token,
        },
        'User logged in Successfully'
      )
    );
});

/*
 * STEPS
 * 1. Just clear user cookies.
 */
const handleLogoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .cookie('token', null, {
      ...cookiesOptions,
      expires: new Date(Date.now()),
    })
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

module.exports = {
  handleSignupUser,
  handleLoginUser,
  handleLogoutUser,
};
