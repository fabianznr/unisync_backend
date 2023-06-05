const dotenv = require('dotenv')
const express = require("express");

dotenv.config({ path: './api/.env' });
const app = express();

const parser = require("body-parser");
const { router }  = require("./api/routes.js");


app.use(parser.urlencoded({ extended: true }));

app.use(parser.json());

app.use("/v1", router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("[Server] online " + new Date()));