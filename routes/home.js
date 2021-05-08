const express = require('express');
const route = express.Router();
const auth = require('../utils/auth')

route.get('/', auth.checkCookies, async (req, res) => {
    console.log(req.cookies.jwt);
    //console.log(req.signedCookies);
    res.end('<h1>HomE</h1>');
});

module.exports = route;
