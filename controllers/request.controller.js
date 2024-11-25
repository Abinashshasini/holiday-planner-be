const { asyncHandler } = require('../utils/asyncHandler');
const ConnectionRequest = require('../models/connectionRequest.js');
const { ApiError } = require('../utils/apiError.js');
const User = require('../models/user.js');
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
const handleLikeOrPass = asyncHandler(async (req, res) => {
  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;
  const status = req.params.status;
  const allowedStatus = ['ignored', 'intrested'];

  if (!allowedStatus.includes(status)) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, `Invalid status type ${status}`));
  }

  const toUser = await User.findById(toUserId);
  if (!toUser) {
    throw new ApiError('User not found!');
  }

  const isExistingConnectionRequest = ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (isExistingConnectionRequest) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          {},
          `Invalid connection request request already present`
        )
      );
  }

  const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
  });

  const response = await connectionRequest.save();

  return res
    .status(201)
    .json(
      new ApiResponse(200, response, 'Connection request sent successfully.')
    );
});

module.exports = {
  handleLikeOrPass,
};
