const dotenv = require('dotenv').config({ path: './api/.env' });
const express = require("express");
const app = express();
const parser = require("body-parser");

import routes from "./api/routes.mjs";



app.use(parser.urlencoded({ extended: true }));

app.use(parser.json());

app.use("/v1", routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("[Server] online " + new Date()));