const User = require('../models/users');
const { SECRET } = require('../config');
const { Strategy, ExtractJwt } = require('passport-jwt');

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: SECRET,
}

module.exports = (passport) => {
    passport.use(new Strategy(opts, async (jwt_payload, done) => {
        await User.findById(jwt_payload.user_id).then(user => {
            if (user) {
                console.log("Ankur")
                return done(null, user);
            } else {
                console.log(user)
                return done(null, false);
                // or you could create a new account
            }
        }).catch(err => {
            console.log(err)
            return done(err, false);
        })
    }));
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}

