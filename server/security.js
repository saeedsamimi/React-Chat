const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function generateHash(text) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(text, salt);
    } catch (error) {
        throw error;
    }
}

async function verifyHash(text, hash) {
    try {
        return await bcrypt.compare(text, hash);
    } catch (error) {
        throw error;
    }
}

function generateAccessToken(user_id) {
    return jwt.sign({id: user_id},
        process.env.JWT_SECRET,
        {expiresIn: "3 days"}
    );
}

const authenticateToken = header => new Promise((resolve, reject) => {
    if (header) {
        jwt.verify(header, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded.id);
        });
    } else
        reject(new Error("bad header format"))
});

module.exports = {
    generateHash,
    verifyHash,
    generateAccessToken,
    authenticateToken
}