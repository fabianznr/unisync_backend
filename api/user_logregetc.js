import bcrypt from "bcryptjs";
import { db } from "./database.js";
import jwt from 'jsonwebtoken';

export async function login(req, res) {

    const user = req.body.user;
    const password = req.body.password;

    try {
        const result = await db.pool.query('Select * from Account Where Benutzer = ?', [user]);
        if (result.length > 0) {
            const hashedPassword = result[0].Passwd;
            if (await bcrypt.compare(password, hashedPassword)) {
                token = generateAccessToken(user)
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

    const hashedPw= await bcrypt.hash(req.body.password, 10);
    try {
        await db.pool.query("Insert into Account(Benutzer, Passwd, Email) values(?, ?, ?)", [user, hashedPw, email]);
        token = generateAccessToken(user)
        res.status(201).json(token);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function generateAccessToken(user) {
    try {
        const token = jwt.sign({ user: user } , process.env.TOKEN_SECRET,  expiresIn: '1h' );
        const result = await db.pool.query('Select AccountID from Account Where Benutzer = ?', [user]);
        console.log(result);
        return token;
    }
    catch (err) {
        throw err;
    }
    
   
}

export function authenticateUser(token) {

}