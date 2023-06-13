import Validator from "validator";
import {ifEmpty} from "./checkEmpty.js";
import { db } from "../database.js"; 
import log from "log-to-file";

export async function checkRegistrationFields(data) {

    let errors = {};

    log(`Register Attempt: ${data.email} ${data.user} ${data.password}`);

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
        errors.password = "Password is required";
    }
    if (!Validator.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")) {
        errors.password = "Passwords must be greater than 8 characters and contain atleast one Upper and Lower case and a special Character.";
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
