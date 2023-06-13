import express from "express";
import { checkRegistrationFields } from "./validation/register.js";
import { login, register, authenticateUser } from "./user_logregetc.js";
import { db } from "./database.js";
import log from "log-to-file";


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
        const result = await db.pool.query("Select * from Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});

router.get("/modul", async (req, res) => {

    try {
        const accountId = await authenticateUser(req);

        const id = req.param('id');

        const result = await db.pool.query("Select * from Modul where ModulId = ?", [id]);
        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err)
    }
});

router.get("/completed", async (req, res) => {
    try {
        const accountId = await authenticateUser(req);
        const query =   `SELECT M.Name
                         FROM Modul M
                         JOIN ModulAbgeschlossen MA ON M.ModulID = MA.ModulID
                         WHERE MA.AccountId = ?`;

        
        const result = await db.pool.query(query, [accountId]);

        log("Completed Request query: " + result)

        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err);
    }
})

router.get("/running", async (req, res) => {
    try {
        const accountId = await authenticateUser(req);
        const query =   `SELECT M.Name
                         FROM Modul M
                         JOIN ModulBelegt MB ON M.ModulID = MB.ModulID
                         WHERE MB.AccountId = ?`;


        const result = await db.pool.query(query, [accountId]);

        log("Completed Request query: " + result)

        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err);
    }
})

router.get("/timetable", async (req, res) => {
    try {
        const accountId = await authenticateUser(req);
        const query = ` SELECT S.Name AS StundenplanName
                        FROM Stundenplan S
                        JOIN Account A ON S.AccountID = A.AccountID
                        WHERE S.AccountID = ? OR (S.Public = 1 AND A.StudiengangID = S.StudiengangID)`;

        const result = await db.pool.query(query, [accountId]);

        res.status(200).json(result);
    } catch (err) {
        res.status(400).send(err)
    }

})

router.get("/timetable_data", async (req, res) => {
    try {
        const timetableID = req.param('id');

        const accountId = await authenticateUser(req);
        const query = ` SELECT SM.StundenplanModulId, M.ModulID, M.Name, M.Professor, SM.Startzeit, SM.Endzeit, SM.Typ, SM.Tag
                        FROM StundenplanModul SM
                        JOIN Modul M ON SM.ModulID = M.ModulID
                        WHERE SM.StundenplanID = ?`;

        const result = await db.pool.query(query, [timetableID]);

        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
