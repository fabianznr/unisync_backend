const dotenv = require('dotenv');
const express = require("express");
const parser = require("body-parser");
const { router }  = require("./api/routes.js");

dotenv.config({ path: './api/.env' })

const app = express();



app.use(parser.urlencoded({ extended: true }));

app.use(parser.json());

app.use("/v1", router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("[Server] online " + new Date()));