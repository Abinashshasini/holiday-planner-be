const { asyncHandler } = require('../utils/asyncHandler');
const Leads = require('../models/leads.js');
const validator = require('validator');
const { ApiError } = require('../utils/apiError.js');
const { ApiResponse } = require('../utils/apiResponse.js');

/**
 * STEPS
 * 1. Get user details and send to frontend.
 */
const handleGetAllLeads = asyncHandler(async (req, res) => {
  const records = await Leads.find({});
  return res
    .status(201)
    .json(new ApiResponse(200, records, 'All leads Fetched success'));
});

/*
 * STEPS
 * 1. Get user details from req.
 * 2. Sanitise the fields and update them in dB.
 */
const handleSubmitLead = asyncHandler(async (req, res) => {
  const { name, number, message } = req.body;

  if (!name) {
    throw new ApiError(400, 'Name is required.');
  }

  if (!number || !validator.isMobilePhone(number)) {
    throw new ApiError(400, 'Number is required.');
  }

  const lead = await Leads.create({
    name: name.toLowerCase(),
    number: number,
    message,
  });

  if (!lead) {
    throw new ApiError(500, 'Something went wrong while submiting the lead');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, lead, 'Response submited success fully'));
});

module.exports = {
  handleGetAllLeads,
  handleSubmitLead,
};
