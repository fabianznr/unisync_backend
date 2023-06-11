import express from "express";
import { checkRegistrationFields } from "./validation/register.js";
import { login, register, authenticateUser } from "./user_logregetc.js";
import { db } from "./database.js";



export const router = express.Router();

router.post("/register", async (req, res) => {
    //Validates Data and Checks for existing Email and User
    const { errors, isValid } = await checkRegistrationFields(req.body);

    if (!isValid) {
        return res.status(400).send(errors);
    }
    else {
        await register(req, res);
    }
    
});
router.post("/login", async (req, res) =>
{
    await login(req, res);
    
});
router.get("/users", async (req, res) => {
    try {
        const result = await db.pool.query("Select * from Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});

router.get("/modul", async (req, res) => {

    try {
        const id = req.param('id');

        const result = await db.pool.query("Select * from Modul where ModulId = ?", [id]);
        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err)
    }
});

router.get("/completed", async (req, res) => {
    try {
        const accountId = authenticateUser(req);

        const query =   `SELECT M.Name
                         FROM Modul M
                         JOIN ModulAbgeschlossen MA ON M.ModulID = MA.ModulID
                         WHERE MA.AccountId = ?`;

        const result = await db.pool.query(query, [accountId]);

        res.status(400).json(result);

    } catch (err) {
        res.status(400).send(err);
    }
})
router.get("/timetable_data", async (req, res) => {
    try {
        const id = req.param('id');
    }
    catch (err) {
        res.status(400).send(err);
    }
});
