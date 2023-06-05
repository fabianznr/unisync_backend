import express from "express";
import { checkRegistrationFields } from "./validation/register.js";
import { login, register } from "./user_logregetc.js";
import { query, conTest } from "./database.js";



export const router = express.Router();

router.post("/register", async (req, res) => {
    //Validates Data and Checks for existing Email and User
    const { errors, isValid } = await checkRegistrationFields(req.body);

    if (!isValid) {
        return res.status(400).send(errors);
    }

    await register(req, res);
});
router.post("/login", async (req, res) =>
{
    await login(req, res);
    
});
router.get("/users", async (req, res) => {
    try {
        const result = await query("Select * from Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});

router.get("/db_test", async (req, res) => {
    await conTest();
});