const express = require('express');
const router = express.Router();
//Bring The user Registration Function
const { userRegister, userLogin, checkRole, userAuth, serializeUser, checkCookies } = require('../utils/auth');

router.get('/', (req, res) => {
    res.end('<h1>AutH</h1>');
})
router.get('/register-user', (req, res) => {
    res.render('auth/user/register');
});

//admin registration route
router.get('/register-admin', async (req, res) => {
    res.render('auth/admin/register');
});

//super-admin registration route
router.get('/register-super-admin', async (req, res) => {
    res.render('auth/super-admin/register');
});

//user registration route
router.post('/register-user', async (req, res) => {
    await userRegister(req.body, 'user', res);
});

//admin registration route
router.post('/register-admin', async (req, res) => {
    await userRegister(req.body, 'admin', res);
});

//super-admin registration route
router.post('/register-super-admin', async (req, res) => {
    await userRegister(req.body, 'super-admin', res);
});

//user login route
router.get('/login-user', async (req, res) => {
    res.render('auth/user/login');
});

//admin login route
router.get('/login-admin', async (req, res) => {
    res.render('auth/admin/login');
});

//super-admin login route
router.get('/login-super-admin', async (req, res) => {
    res.render('auth/super-admin/login');
});


//user login route
router.post('/login-user', async (req, res) => {
    await userLogin(req.body, 'user', res);
});

//admin login route
router.post('/login-admin', async (req, res) => {
    await userLogin(req.body, 'admin', res);
});

//super-admin login route
router.post('/login-super-admin', async (req, res) => {
    await userLogin(req.body, 'super-admin', res);
});

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
    return res.json(serializeUser(req.user));
});

//user protected route
router.get('/profile-user', checkCookies, userAuth, checkRole(['user']), async (req, res) => {
    return res.json("Hello User");
});

//admin protected routeasync
router.get('/profile-admin', userAuth, checkRole(['admin']), async (req, res) => {
    return res.json("Hello Admin");
});

//super-admin protected route
router.get('/profile-super-admin', checkCookies, userAuth, checkRole(['super-admin']), async (req, res) => {
    return res.json("Hello Super Admin");
});

router.get("/a", checkCookies, async (req, res) => {
    res.end('<h1>Finnaly</h1>')
});

module.exports = router