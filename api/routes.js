const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("./database");

const checkRegistrationFields = require("./validation/register");

router.post("/register", async (req, res) => {
    const { errors, isValid } = checkRegistrationFields(req.body);

    if (!isValid) {
        return res.status(400).send(errors);
    }
    let token;
    crypto.randomBytes(48, (err, buf) => {
        token = buf.toString("base64")
            .replace(/\//g, "")
            .replace(/\+/g, "-");
        return token;
    });
    bcrypt.genSalt(12, async (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password1, salt, async (err, hash) => {
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

router.get("/users", async (req, res) => {
    try {
        const result = await db.pool.query("Select * from Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = router;