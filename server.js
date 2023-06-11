import 'dotenv/config';
import express from "express";
const app = express();
import log from "log-to-file";

import parser from "body-parser";
import { router } from "./api/routes.js";


app.use(parser.urlencoded({ extended: true }));

app.use(parser.json());

app.use("/v1", router);

const port = process.env.PORT || 3000;

app.listen(port, () => log("[Server] online " + new Date()));
