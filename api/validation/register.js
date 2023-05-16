
const Validator = require("validator");
const empty = require("./checkEmpty");
const db = require("../database");

module.exports = function checkRegistrationFields(data) {

  let errors = {};

  data.email = !empty(data.email) ? data.email : "";
  data.password1 = !empty(data.password1) ? data.password1 : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
    }
    
    if (!Validator.isEmail(data.email)) {
        errors.email = "Email address is invalid";
    } else {
        try {
            const result = db.pool.query("Select Email from Account Where Email= ?", [data.email]);
            if (result.length > 0) {
                errors.email = "This Email is already in use";
            }
        } catch (err) {
            errors.email = err
        }
        

    }
  if (Validator.isEmpty(data.password1)) {
    errors.password1 = "Password is required";
  }
  if (!Validator.isLength(data.password1, { min: 8, max: 120 })) {
      errors.password1 = "Passwords must be greater than 8 characters";
  }
  
  return {
    errors,
    isValid: empty(errors),
  };
};
