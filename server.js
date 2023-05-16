const express = require("express");
const app = express();
const parser = require("body-parser");

const routes = require("./api/routes/users");


app.use(parser.urlencoded({ extended: true }));

app.use(parser.json());

app.use("/v1/users", routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("[Server] online " + new Date()));