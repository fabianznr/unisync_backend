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

    try {
        await register(req, res);
    }
    catch (err) {
        res.status(400).send(err);
    }
  
    
});
router.post("/login", async (req, res) =>
{
    await login(req, res);
    
});

router.get("/users", async (req, res) => {
    try {
        const result = await db.pool.query("SELECT * FROM Account");
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
});

router.get("/modul", async (req, res) => {

    try {
        await authenticateUser(req);

        const id = req.param('id');

        const result = await db.pool.query("SELECT * FROM Modul WHERE ModulId = ?", [id]);
        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err)
    }
});

router.get("/all_modul_from", async (req, res) => {
    try {
        const id = req.param('id');

        const query = `  SELECT M.*
                        FROM Modul M
                        JOIN StudiengangModul SM ON M.ModulID = SM.ModulID
                        JOIN Studiengang S ON SM.StudiengangID = S.StudiengangID
                        WHERE S.StudiengangID = ?`;

        const result = await db.pool.query(query, [id]);

        res.status(200).json(result);
    } catch (err) {
        res.status(400).send(err);
    }

});

router.post("/add_modul", async(req, res) => {
    try{
        const accountId = await authenticateUser(req);

        const modulname = req.body.modulname;
        const semester = req.body.semester;
        const professor = req.body.professor;
        
        let query =     `INSERT INTO Modul (Name, Semester, Professor)
                         VALUES(?,?,?)`;

        let result = await db.pool.query(query, [modulname, semester, professor])
        log(`Completed Request query: ${result} , to add Modul`)

        const studiengangId = req.body.studiengangId;

        query =         `INSERT INTO StudiengangModul (StudiengangID, ModulID)
                         VALUES(?,?)`;

        result = await db.pool.query(query, [studiengangId]);

        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err);
    }
    
});

router.get("/completed", async (req, res) => {
    try {
        const accountId = await authenticateUser(req);
        const query = `SELECT M.ModulID, M.Name
                         FROM Modul M
                         JOIN ModulAbgeschlossen MA ON M.ModulID = MA.ModulID
                         WHERE MA.AccountId = ?`;


        const result = await db.pool.query(query, [accountId]);

        log(`Completed Request query: ${result}`)

        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/running", async (req, res) => {
    try {
        const accountId = await authenticateUser(req);
        const query = `SELECT M.ModulId, M.Name
                         FROM Modul M
                         JOIN ModulBelegt MB ON M.ModulID = MB.ModulID
                         WHERE MB.AccountId = ?`;


        const result = await db.pool.query(query, [accountId]);

        log(`Completed Request query: ${result}`)

        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/add_kurs", async (req, res) => {
    try {

        const raum = req.body.raum;
        const startzeit = req.body.startzeit;
        const endzeit = req.body.endzeit;
        const typ = req.body.typ;
        const tag = req.body.tag;
        const modulid = req.body.modulid;

        const query = ` INSERT INTO Kurs
                        (Raum, Startzeit, Endzeit, Typ, Tag, ModulID)
                        VALUES(?, ?, ?, ?, ?, ?) `;

        const result = await db.pool.query(query, [raum, startzeit, endzeit, typ, tag, modulid]);

        log(`Completed Request query: ${result}`)

        res.status(200).json(result);

    } catch (err) {
        res.status(400).send(err);
    }
});

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

});

router.get("/timetable_data", async (req, res) => {
    try {
        const timetableID = req.param('id');

        await authenticateUser(req);
        const query = ` SELECT K.KursID, K.Startzeit, K.Endzeit, K.Typ, K.Tag, M.Name AS Modulname, SP.Name AS Stundenplanname
                        FROM Kurs K
                        JOIN Modul M ON K.ModulID = M.ModulID
                        JOIN StundenplanKurs SK ON K.KursID = SK.KursID
                        JOIN Stundenplan SP ON SK.StundenplanID = SP.StundenplanID
                        WHERE SP.StundenplanID = ?`;

        const result = await db.pool.query(query, [timetableID]);

        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
