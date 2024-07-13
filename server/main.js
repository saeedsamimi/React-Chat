require('dotenv').config();

const express = require('express');
const cors = require('cors');
const security = require("./security/security");
const multer = require("multer");
const pool = require("./database/db");
const cookieParser = require('cookie-parser')
const {resolve, extname} = require("node:path");

const app = express();

const cookie_options = {httpOnly: true, secure: true, sameSite: 'strict'};

const client_origin = process.env.CLIENT_ORIGIN
if (!client_origin) console.error("The client origin is not set!");
else app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resolve(__dirname, 'public'));
    },
    filename: (req, file, cb) => {
        const UID = Date.now()
        cb(null, UID + extname(file.originalname));
    }
})

const upload = multer({storage: storage});
const uploadNone = upload.none()

app.post("/signup", uploadNone, async (req, res) => {
    const userInsertion = "INSERT INTO users(username,password) VALUES ($1,$2) RETURNING id,username,name";
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password)
        return res.sendStatus(500);
    try {
        const hash = await security.generateHash(password);
        const result = await pool.query(userInsertion, [username, hash]);
        res.cookie('token', security.generateAccessToken(result.rows[0].id), cookie_options)
        res.status(200).send(result.rows[0]);
    } catch (err) {
        if (err.code === '23505')
            res.status(409).send("the user is already exist!");
        else {
            console.log(err)
            res.sendStatus(500);
        }
    }
})

app.post("/login", uploadNone, async (req, res) => {
    const userFoundation = "SELECT * FROM users WHERE username = $1 LIMIT 1";
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password)
        return res.sendStatus(500);
    try {
        const foundUser = await pool.query(userFoundation, [username]);
        if (foundUser.rows.length === 0)
            return res.status(404).send("The user is not found");
        const verified = await security.verifyHash(password, foundUser.rows[0].password);
        if (verified) {
            res.cookie('token', security.generateAccessToken(foundUser.rows[0].id), cookie_options)
            res.status(200).send(foundUser.rows[0]);
        } else
            res.status(401).send("The user password is incorrect");
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})

app.post("/auth", async (req, res) => {
    try {
        const userFoundation = "SELECT * FROM users WHERE id = $1 LIMIT 1";
        const id = await security.authenticateToken(req.cookies.token);
        const user = await pool.query(userFoundation, [id])
        if (user.rows.length === 0)
            res.sendStatus(401);
        else
            res.status(200).send(user.rows[0]);
    } catch (err) {
        console.log(err);
        res.sendStatus(403);
    }
})

app.delete("/auth", async (req, res) => {
    try {
        res.clearCookie('token', cookie_options);
        res.sendStatus(200);
    } catch (err) {
        console.error(err)
        res.sendStatus(500);
    }
})

app.post("/rename", async (req, res) => {
    try {
        const name = req.body.name;
        console.log(name)
        if (!name)
            res.sendStatus(403);
        else {
            const userRename = "UPDATE users SET name = $1 WHERE id = $2 RETURNING *"
            const id = await security.authenticateToken(req.cookies.token)
            const user = await pool.query(userRename, [name, id])
            res.status(200).send(user.rows[0])
        }
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.post("/profile", upload.single('profile'), async (req, res) => {
    try {
        const id = await security.authenticateToken(req.cookies.token)
        const updateProfile = "UPDATE users SET profile = $1 WHERE id = $2 RETURNING *"
        const result = await pool.query(updateProfile, [req.file.filename, id]);
        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.use('/pictures', express.static(resolve(__dirname, 'public')))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
})
