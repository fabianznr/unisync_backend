const express = require("express");
const { checkRegistrationFields } = require("./validation/register.js");
const { login, register } = require("./user_logregetc.js");
const db = require("./database.js");



const router = express.Router();

router.post("/register", async (req, res) => {
    //Validates Data and Checks for existing Email and User
    const { errors, isValid } = await checkRegistrationFields(req.body);

    if (!isValid) {
        return res.status(400).send(errors);
    }

    await register(req, res);
});
router.post("/login", async (req, res) =>
{
    await login(req, res);
    
});
router.get("/users", async (req, res) => {
    try {
        const result = await db.pool.query("Select * from Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});


module.exports.router = router;