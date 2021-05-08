const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { SECRET } = require('../config/index');

/*
@DESC To Register the User (Admin, Super-Admin, User)
*/

const userRegister = async (userDetails, role, res) => {

    try {
        //validate User Name
        let userNameNotTaken = await validateUserName(userDetails.username);
        if (!userNameNotTaken) {
            return res.status(400).json({
                message: `User Name is Already Taken`,
                success: `false`
            });
        }
        //validate User Email
        let userEmailNotTaken = await validateEmail(userDetails.email);
        if (!userEmailNotTaken) {
            return res.status(400).json({
                message: `Email is Already Taken`,
                success: `false`
            });
        }

        //Get Hashed Password
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);
        //Create A new user
        const newUser = new User({
            ...userDetails,
            password: hashedPassword,
            role
        });
        console.log(newUser);
        const token = await newUser.generateAuthToken();

        await newUser.save();
        return res.status(200).json({
            message: `Successfully Registered`,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Not Registered`,
            success: false
        });
    }
}



/*
@DESC To Login the User (Admin, Super-Admin, User)
*/

const userLogin = async (userDetails, role, res) => {
    let { username, password } = userDetails;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "User Name Not Found",
            success: false
        });
    }
    //Check User Role
    if (user.role !== role) {
        return res.status(403).json({
            message: "Login from Right Portal",
            success: false
        });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        // let token = jwt.sign({
        //     user_id: user.id,
        //     role: user.role,
        //     username: user.username,
        //     email: user.email
        // }, SECRET, { expiresIn: '7 days' });

        const token = await user.generateAuthToken();

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 5000000),
            httpOnly: true
        })

        let result = {
            username: user.username,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168,
        }
        return res.status(200).json({
            ...result,
            message: `Successfully Logged In`,
            success: true
        });

    } else {
        return res.status(403).json({
            message: "Incorrect password",
            success: false
        });
    }

}
const checkCookies = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token, SECRET);
        next();
    } catch (error) {
        res.status(404).json({
            message: ":P",
            success: false
        });
    }
}

/*
@DESC Passport Middlewere 
*/
const userAuth = passport.authenticate("jwt");
console.log(userAuth);
/*
@DESC Check Role Middlewere
*/
const checkRole = roles => (req, res, next) =>
    !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized Sad")
        : next();

const serializeUser = user => {
    return {
        username: user.username,
        email: user.email,
        name: user.name,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    };
};

const validateUserName = async (username) => {
    let user = await User.findOne({ username });
    console.log(`User Name Taken ${user}`);
    return user ? false : true; //if there is a user it will return false, otherwise it will return true
}

const validateEmail = async email => {
    let user = await User.findOne({ email });
    return user ? false : true; //if there is a user it will return false, otherwise it will return true
}


module.exports = {
    checkRole,
    userLogin,
    userRegister,
    userAuth,
    serializeUser,
    checkCookies
}