import dotenv from 'dotenv';
import express from "express";

dotenv.config({ path: './api/.env' });
const app = express();

import parser from "body-parser");
import { router } from "./api/routes.js";


app.use(parser.urlencoded({ extended: true }));

app.use(parser.json());

app.use("/v1", router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("[Server] online " + new Date()));