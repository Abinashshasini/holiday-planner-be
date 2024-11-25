const mongoose = require('mongoose');
const validator = require('validator');

const leadsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 200,
    },

    number: {
      type: Number,
      required: true,
      minLength: 10,
      maxLength: 10,
    },

    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Leads', leadsSchema);
