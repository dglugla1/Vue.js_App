const express = require("express");
const app = express();
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser("secret"));

const expressSession = require("express-session");
app.use(expressSession({
    secret: "nasjcklna",
    resave: false,
    saveUninitialized: false
}))

var cors = require('cors');
app.use(cors({ credentials: true, origin: 'http://192.168.0.12:6001' }));

const http = require('http').Server(app);
const io = require('socket.io')(http, { cors: { origin: 'http://192.168.0.12:6001', methods: ["GET", "POST"] } })
const socket = require('./sockets')(io);

app.use(express.static("../client/dist"));

const client = require('./config');
client
    .connect()
    .then(async () => {
        console.log("Connected to PostgreSQL");
        const port = 6001;
        http.listen(port, () => {
            console.log(`API server listening at http://192.168.0.12:${port}`);
        });
    })
    .catch(err => console.error("Connection error", err.stack));

const auth = require('./auth');
app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.get("/auth", auth.ifAuthenticated);
app.post("/login", auth.authUser);
app.get("/logout", (req, res) => {
    req.logOut();
    res.send("Successfully logged out");
});


const multer = require('multer');
const upload = multer();
const que = require('./queries');

app.get("/user", que.getUser);
app.get("/userid", que.getUserId);
app.get("/user/:id", que.getUserById);
app.post("/register", que.register);
app.post("/change", que.changePassword);
app.get("/subreddit", que.getSubreddits);
app.get("/subreddit/:name", que.getSubredditByName);
app.get("/subreddit/:name/descr", que.getSubredditDescription);
app.patch("/subreddit/:name/editdescr", que.editSubredditDescription);
app.post('/subreddit/:name/addPost', upload.single('file'), que.addPost);
app.post('/subreddit/addSubreddit', que.addSubreddit);
app.get('/subreddit/mod/:name', que.checkIfModerator);
app.get('/subreddit/:name/subscription', que.checkIfSubscribed);
app.post('/subreddit/:name/subscription', que.subscribe);
app.post('/subreddit/:name/p/votes',que.votes);
app.post('/subreddit/:name/p/voting', que.voting);
app.post('/subreddit/:name/p/comments',que.comments);
