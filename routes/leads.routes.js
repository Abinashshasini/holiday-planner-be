const { Router } = require('express');
const {
  handleGetAllLeads,
  handleSubmitLead,
} = require('../controllers/leads.controller.js');

const router = Router();

/** Declaring user routes */
router.route('/submit-lead').post(handleSubmitLead);
router.route('/get-leads').get(handleGetAllLeads);

module.exports = router;
