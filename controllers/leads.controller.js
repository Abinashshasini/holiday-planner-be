const { asyncHandler } = require('../utils/asyncHandler');
const Leads = require('../models/leads.js');
const validator = require('validator');
const { ApiError } = require('../utils/apiError.js');
const { ApiResponse } = require('../utils/apiResponse.js');

/**
 * STEPS
 * 1. Get leads from db and send it to FE.
 * 2. Filter for today's records.
 * 3. Filter for yesterday's records
 *
 */
const handleGetAllLeads = asyncHandler(async (req, res) => {
  const { filter } = req.query;
  let query = {};

  if (filter === 'today') {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    query = {
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    };
  } else if (filter === 'yesterday') {
    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date();
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999);

    query = {
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
    };
  }

  const records = await Leads.find(query).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        records,
        `${filter || 'All'} leads fetched successfully`
      )
    );
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
