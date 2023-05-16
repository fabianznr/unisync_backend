// simple-api/validation/register.js
const Validator = require("validator");
const ifEmpty = require("./checkForEmpty");

module.exports = function checkRegistrationFields(data) {
  // An errors object is created
  let errors = {};

  // If data.email is not empty, data.email = data.email
  // else if empty, data.email = ""
  data.email = !ifEmpty(data.email) ? data.email : "";
  data.password1 = !ifEmpty(data.password1) ? data.password1 : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  if (!Validator.isEmail(data.email)) {
      errors.email = data.email;//"Email address is invalid";
  }
  if (Validator.isEmpty(data.password1)) {
    errors.password1 = "Password is required";
  }
  if (!Validator.isLength(data.password1, { min: 8, max: 120 })) {
      errors.password1 = data.password1;//"Passwords must be greater than 8 characters";
  }

  // Return the errors from the checkRegistrationFields function
  // and use the ifEmpty function to check if the errors object is empty
  return {
    errors,
    isValid: ifEmpty(errors),
  };
};
