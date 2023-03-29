const passport = require("passport");
const passportLocal = require("passport-local");
const client = require('./config');

const validateUser = async (username, password, done) => {
    let user = await client.query("SELECT * FROM reddit_user WHERE email=$1;", [username])
    user = user['rows'][0];
    if (!user) {
        done(null, null);
    }
    else if (username === user.email && password === user.password) {
        done(null, {
            id: user.id,
            username: user.email,
            password: user.password
        });
    } else {
        done(null, null);
    }
}

passport.use(new passportLocal.Strategy(validateUser));

passport.deserializeUser(async (id, done) => {
    user = await client.query("SELECT * FROM reddit_user WHERE id=$1;", [id]);
    user = user["rows"][0];
    done(null, {
        id: user.id,
        username: user.email,
        password: user.password
    });
});
passport.serializeUser((user, done) => {
    done(null, user.id);
})

const authUser = (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) {
            res.status(500);
            res.send({ 'msg': 'Something went wrong' });
        };
        if (!user) {
            res.status(401);
            res.send({ 'msg': 'Unauthorized' });
        }
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.send({ 'msg': "Successfully Authenticated" });
            });
        }
    })(req, res, next);
};

const ifAuthenticated = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    else {
        return res.send({ "response": "ok" })
    }
}

module.exports = {
    authUser,
    passport,
    passportLocal,
    validateUser,
    ifAuthenticated
}