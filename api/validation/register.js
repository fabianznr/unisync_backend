const Validator = require("validator");
const ifEmpty = require("./checkEmpty.js");
const db = require("../database.js");

module.exports.checkRegistrationFields = async function checkRegistrationFields(data) {

    let errors = {};

    data.email = !ifEmpty(data.email) ? data.email : "";
    data.password = !ifEmpty(data.password) ? data.password : "";
    data.user = !ifEmpty(data.user) ? data.user: "";

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
            errors.email = err;
        }
    }
    if (Validator.isEmpty(data.password)) {
        errors.password1 = "Password is required";
    }
    if (!Validator.isLength(data.password, { min: 8, max: 120 })) {
        errors.password1 = "Passwords must be greater than 8 characters";
    }
    if (!Validator.isEmpty(data.user))
    {
        try {
            const result = await db.pool.query("Select Benutzer from Account Where Benutzer= ?", [data.user]);
            if (result.length > 0) {
                errors.user = "This username is already taken";
            }
        } catch (err) {
            errors.user = err;
        }
    }

    return {
        errors,
        isValid: ifEmpty(errors),
    };
};
