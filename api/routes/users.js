const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypt = require("crypt");
const db = require("../database");

const test =

const checkRegistrationFields = require("../validation/register");

router.get("/", function (req, res) {
    res.send({ msg: "Hello World" });
});

router.post("/register", (req, res) => {
    const { errors, isValid } = checkRegistrationFields(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    let token;
    crypto.randomBytes(48, (err, buf) => {
        token = buf.toString("base64")
            .replace(/\//g, "")
            .replace(/\+/g, "-");
        return token;
    });
    bcrypt.genSalt(12, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password1, salt, (err, hash) => {
            if (err) throw err;
            try {
                const result = await db.pool.query(`Insert into Account(Benutzer, Passwd, Email) values(${req.body.user},${hash},${req.body.email})`, [task.description]);
                res.send(result);
            } catch (err) {
                throw err;
            }
        })
    })
});

module.exports = router;