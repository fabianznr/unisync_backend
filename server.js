import 'dotenv/config';
import express from "express";
const app = express();

import parser from "body-parser";
import { router } from "./api/routes.js";

import crypto from 'crypto';

console.log(crypto.randomBytes(64).toString('hex'))

app.use(parser.urlencoded({ extended: true }));

app.use(parser.json());

app.use("/v1", router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("[Server] online " + new Date()));
