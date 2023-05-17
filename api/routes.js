const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("./database");

const checkRegistrationFields = require("./validation/register");

router.post("/register", async (req, res) => {
    const { errors, isValid } = await checkRegistrationFields(req.body);

    if (!isValid) {
        return res.status(400).send(errors);
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        await db.pool.query("Insert into Account(Benutzer, Passwd, Email) values(?,?,?)", [req.body.user, hashedPassword, req.body.email]);
        res.status(200).send("Query sucessfull");
    } catch (err) {
        res.status(500).send(err)
    }

});
router.post("/login", async (req, res) =>
{
    const user = req.body.user;
    const password = req.body.password;

    try {
        const result = await db.pool.query("Select * from Account Where Benutzer = ?", [user]);
        if (result.length > 0) {
            console.log(result);
        }
    } catch (err) {
        res.status(500).send(err)
    }
    
});
router.get("/users", async (req, res) => {
    try {
        const result = await db.pool.query("Select * from Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = router;