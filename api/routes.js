const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const checkRegistrationFields = require("./validation/register");
import { login, register } from "./user_logregetc.js";

router.post("/register", async (req, res) => {
    //Validates Data and Checks for existing Email and User
    const { errors, isValid } = await checkRegistrationFields(req.body);

    if (!isValid) {
        return res.status(400).send(errors);
    }

    register(req, res);
});
router.post("/login", async (req, res) =>
{
    login(req, res);
    
});
router.get("/users", async (req, res) => {
    try {
        const result = await db.pool.query("Select * from Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = { router };