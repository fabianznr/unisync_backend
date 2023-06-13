import bcrypt from "bcryptjs";
import { db } from "./database.js";
import jwt from 'jsonwebtoken';
import log from "log-to-file";

export async function login(req, res) {

    const user = req.body.user;
    const password = req.body.password;

    try {
        const result = await db.pool.query('SELECT * FROM Account WHERE Benutzer = ?', [user]);
        if (result.length > 0) {
            const hashedPassword = result[0].Passwd;
            if (await bcrypt.compare(password, hashedPassword)) {
                const token = await generateAccessToken(user)
                res.status(201).header('Authorization', 'Bearer ' + token).json({ message: 'Login complete' });
                res.status(200).json(token);
            } else {
                res.status(401).send("Password incorrect!");
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function register(req, res) {

    const user = req.body.user
    const pw = req.body.password
    const email = req.body.email

    const hashedPw= await bcrypt.hash(pw, 10);
    try {
        await db.pool.query("INSERT INTO Account(Benutzer, Passwd, Email) VALUES(?, ?, ?)", [user, hashedPw, email]);
        const token = await generateAccessToken(user)
        log(`Account creation : ${user} ` );
        res.status(201).header('Authorization', 'Bearer ' + token).json({ message: 'Registration complete' });
    } catch (err) {
        res.status(400).send(err);
    }
}

async function generateAccessToken(user) {

    const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    const expirationTimestamp = new Date(Date.now() + (60 * 60 * 1000));

    let result = await db.pool.query("SELECT AccountID FROM Account WHERE Benutzer = ?", [user]);
    log(`Token Generation: User: ${user} found in db`)
    const accountID = result[0].AccountID;

    await db.pool.query('INSERT INTO AccessToken (Token, expiresAt, AccountID) VALUES (?, ?, ?)', [token, expirationTimestamp, accountID])

    const currentDate = new Date(Date.now());
    const currentDateString = currentDate.toISOString();
    result = await db.pool.query('DELETE FROM AccessToken WHERE expiresAt <= ? AND AccountID = ? ', [currentDateString, accountID]);
    log("Delted token from db");

    return token;
 
}

export async function authenticateUser(req) {

    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET);

    const result = await db.pool.query('SELECT * FROM AccessToken WHERE Token = ?', [token])
    if (result && result.length > 0) {
        return result[0].AccountID
    }
    else {
        throw new Error("Authentication failed");
    }

}