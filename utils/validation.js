const validator = require('validator');
const { ApiError } = require('./apiError');

/** Function to validate user signup data */
const handleValidateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new ApiError(400, 'Name is not valid!');
  } else if (!validator.isEmail(emailId)) {
    throw new ApiError(400, 'Email is not valid!');
  } else if (!validator.isStrongPassword(password)) {
    throw new ApiError(400, 'Please enter a strong Password!');
  }
};

const handleValidateEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'emailId',
    'photoUrl',
    'gender',
    'age',
    'about',
    'skills',
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  handleValidateSignupData,
  handleValidateEditProfileData,
};
