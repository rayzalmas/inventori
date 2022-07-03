const users = require('../configs/data.js').userDB;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var refreshTokensDB = [];

module.exports = {
    async register(req, res, next) {
        try {
            let foundUser = users.find((data) => req.body.email === data.email);
            if (!foundUser) {
                const salt = await bcrypt.genSalt(10);
                const password = await req.body.password;
                let hashPassword = await bcrypt.hash(password, salt);
                let newUser = {
                    id: Date.now(),
                    username: req.body.username,
                    email: req.body.email,
                    password: hashPassword,
                };
                users.push(newUser);
                res.json({ message: 'Registration successful' });
            } else {
                res.json({ message: 'Registration failed' });
            }
        } catch {
            res.json({ message: 'Internal server error' });
        }
    },
    async login(req, res, next) {
        try {
            let foundUser = users.find((data) => req.body.email === data.email);
            if (foundUser) {
                let submittedPass = await req.body.password;
                let storedPass = await foundUser.password;
                const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
                if (passwordMatch) {
                    const tokenEmail = req.body.email;
                    const payload = { email: tokenEmail };
                    const aToken = generateAccessToken(payload);
                    const rToken = jwt.sign(payload, process.env.REFRESH_TOKEN);
                    refreshTokensDB.push(rToken);
                    res.json({ AccessToken: aToken, RefreshToken: rToken, message: 'You are logged-in' });
                } else {
                    res.json({ message: 'Invalid email or password' });
                }
            }
            else {
                res.json({ foundUser })
                let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
                //fake password is used just to slow down the time required to send a response to the user
                let submittedPass = await req.body.password;
                await bcrypt.compare(submittedPass, fakePass);
                res.json({ message: 'Invalid email or password' });
            }
        } catch {
            res.json({ message: 'Internal server error' });
        }
    },
    refreshToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            res.json({ message: 'Invalid refresh token' });
        }
        if (!refreshTokensDB.includes(token)) {
            res.json({ message: 'Forbidden' });
        }
        jwt.verify(token, process.env.REFRESH_TOKEN, (err, payload) => {
            if (err) {
                res.json({ message: 'Some error occured' });
            }
            else {
                const accessToken = generateAccessToken({ email: payload.email })
                res.json({ AccessToken: accessToken, message: 'This is your new access token' });
            }
        });
    },
    deleteToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            res.json({ message: 'Invalid access token' });
        }
        else {
            var index = refreshTokensDB.indexOf(token);
            delete refreshTokensDB[index];
            //refreshTokensDB = refreshTokensDB.filter(data => data !== token);
            res.json({ message: 'Refresh token deleted successfully' });
        }
    }
}

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '2m' });
}