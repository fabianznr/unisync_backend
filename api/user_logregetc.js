import bcrypt from "bcryptjs";
import { db } from "./database.js";

export async function login(req, res) {

    const user = req.body.user;
    const password = req.body.password;

    try {
        const result = await db.pool.query("Select * from Account Where Benutzer = ?", [user]);
        if (result.length > 0) {
            const hashedPassword = result[0].Passwd;
            if (await bcrypt.compare(password, hashedPassword)) {
                res.status(200).send("Logged In!");
            } else {
                res.status(401).send("Password incorrect!");
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function register(req, res) {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        await db.pool.query("Insert into Account(Benutzer, Passwd, Email) values(?,?,?)", [req.body.user, hashedPassword, req.body.email]);
        res.status(200).send("Registration sucessfull");
    } catch (err) {
        res.status(500).send(err);
    }
}
