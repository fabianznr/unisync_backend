const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    res.send({ msg: "Hello World" });
});

module.exports = router;