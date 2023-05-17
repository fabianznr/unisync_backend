const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("./database");

const checkRegistrationFields = require("./validation/register");

const dotenv = require('dotenv').config({ path: '../.env' });

console.log(process.env)

router.post("/register", async (req, res) => {
    const { errors, isValid } = await checkRegistrationFields(req.body);

    console.log(req.body);

    if (!isValid) {
        return res.status(400).send(errors);
    }
    bcrypt.genSalt(12, async (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
            if (err) throw err;
            try {
                await db.pool.query("Insert into Account(Benutzer, Passwd, Email) values(?,?,?)", [req.body.user, hash, req.body.email]);
                res.status(200).send("Query sucessfull");
            } catch (err) {
                res.status(500).send(err)
            }
        })
    })
});
router.get("/login", async (req, res) => {

});
router.get("/users", async (req, res) => {
    try {
        console.log(process.env.DATABASE_host)
        console.log(process.env.DATABASE_port)
        console.log(process.env.DATABASE_user)
        console.log(process.env.DATABASE)
        const result = await db.pool.query("Select * from Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = router;