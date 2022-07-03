require('dotenv').config();

const jwt = require("jsonwebtoken");

function AuthenticateAccessToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // logger.info({headers:req.headers})

    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        res.json({ message: 'token not found.' });
    }
    else {
        let access_token = process.env.ACCESS_TOKEN;
        jwt.verify(token, access_token, function (err, decoded) {
            if (err) {
                res.json({ message: 'Invalid access token.' });
            } else {
                next()
            }
        })
    }
}

module.exports = AuthenticateAccessToken;