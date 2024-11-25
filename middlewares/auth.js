const { ApiError } = require('../utils/apiError');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { asyncHandler } = require('../utils/asyncHandler');

/*
 * STEPS
 * 1. Read the token from user cookies.
 * 2. Validate the token.
 * 3. Find user from dB.
 */
const handleValidateAuthenticateUser = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;
  const { token } = cookies;

  if (!token) {
    throw new ApiError(400, 'Invalid user token');
  }

  const decodedData = await jwt.verify(token, process.env.SECRET_KEY);
  const { _id } = decodedData;

  const user = await User.findById(_id);

  if (!user) {
    throw new Error('User not found');
  }
  req.user = user;
  next();
});

module.exports = {
  handleValidateAuthenticateUser,
};
