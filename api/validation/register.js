
const Validator = require("validator");
const empty = require("./checkEmpty");
const db = require("../database");

module.exports = async function checkRegistrationFields(data) {

    let errors = {};

    data.email = !empty(data.email) ? data.email : "";
    data.password = !empty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.email)) {
      errors.email = "Email is required";

    }
    
    if (!Validator.isEmail(data.email)) {
        errors.email = "Email address is invalid";
    } else {
        try {
            const result = await db.pool.query("Select Email from Account Where Email= ?", [data.email]);
            if (result.length > 0) {
                errors.email = "This Email is already in use";
            }
        } catch (err) {
            errors.email = err
        }
        

    }
    if (Validator.isEmpty(data.password)) {
        errors.password1 = "Password is required";
    }
    if (!Validator.isLength(data.password, { min: 8, max: 120 })) {
        errors.password1 = "Passwords must be greater than 8 characters";
     }
  
    return {
        errors,
        isValid: empty(errors),
    };
};
