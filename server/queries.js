const client = require('./config');

const getUser = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query('SELECT * FROM reddit_user;')
        .then((data) => {
            return res.send(data.rows);
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const getUserId = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query('SELECT id FROM reddit_user WHERE id=$1', [req.user.id])
        .then((data) => {
            return res.send(data.rows);
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const getUserById = (req, res) => {
    client.query('SELECT * FROM reddit_user WHERE id=$1;', [req.params.id])
        .then((data) => {
            return res.send(data.rows);
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const register = (req, res) => {
    client.query('SELECT * FROM reddit_user WHERE email=$1',
        [req.body.email])
        .then((value) => {
            if (value["rows"].length === 0) {
                client.query('INSERT INTO reddit_user (nickname, password,email) VALUES ($1,$2,$3) RETURNING id,nickname,password,email',
                    [req.body.nickname, req.body.password, req.body.email])
                    .then(() => {
                        return res.send({ "response": "Registered successfully" })
                    })
                    .catch(() => {
                        return res.send({ "error": "Something went wrong" })
                    })
            }
            else {
                return res.send({ "response": "User with the same e-mail already exists" })
            }
        })
}

const changePassword = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query('SELECT * FROM reddit_user WHERE id=$1 AND password=$2',
        [req.user.id, req.body.password])
        .then((response) => {
            if (response["rows"].length) {
                client.query('UPDATE reddit_user SET password=$1 WHERE id=$2',
                    [req.body.password1, req.user.id])
                return res.send({ "response": "ok" })
            }
            else {
                return res.send({ "response": "nie ok" })
            }
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const getSubreddits = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query('SELECT * FROM subreddit;')
        .then((data) => {
            return res.send(data.rows);
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const getSubredditByName =  (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query('SELECT id FROM subreddit WHERE name=$1', [req.params.name])
        .then((data) => {
            if (data["rows"].length === 0) {
                return res.send({ "Error": "Subreddit doesn't exist" })
            }
            else {
                client.query('SELECT * FROM post WHERE subreddit_id=$1', [data["rows"][0]["id"]])
                    .then((data2) => {
                        return res.send(data2.rows);
                    })
                    .catch(() => {
                        return res.send({ "error": "Something went wrong" })
                    })
            }
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const getSubredditDescription = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query('SELECT description FROM subreddit WHERE name=$1', [req.params.name])
        .then((data) => {
            if (data["rows"].length === 0) {
                return res.send({ "Error": "Subreddit doesn't exist" })
            }
            else {
                return res.send(data["rows"]);
            }
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const editSubredditDescription =  (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query('UPDATE subreddit SET description=$1 WHERE name=$2', [req.body.description, req.params.name])
        .then(() => {
            return res.send({ "response": "ok" })
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const fs = require("fs");
const addPost = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    if (req.file !== 'null' && req.file !== null && req.file !== undefined) {
        fs.writeFile(`../client/public/uploads/${req.file.originalname}`, req.file.buffer, function (err) {
            if (err) return console.log(err);
        });
    }
    if (req.body.content === 'null') {
        req.body.content = null;
    }
    if (req.body.video_url === 'null') {
        req.body.video_url = null;
    }
    client.query("SELECT id FROM subreddit WHERE name=$1", [req.params.name])
        .then((values) => {
            if (req.file.originalname) {
                client.query("INSERT INTO post (title,content,image_path,video_url,creation_date,subreddit_id,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,title,content,image_path,video_url,creation_date,subreddit_id,user_id",
                    [req.body.title, req.body.content, `uploads/${req.file.originalname}`, req.body.video_url, new Date().toISOString(), values["rows"][0]["id"], req.user.id])
                    .then((values_from_insert) => {
                        return res.send(values_from_insert["rows"]);
                    })
                    .catch(() => {
                        return res.send({ "error": "Something went wrong" })
                    })
            }
            else {
                client.query("INSERT INTO post (title,content,image_path,video_url,creation_date,subreddit_id,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,title,content,image_path,video_url,creation_date,subreddit_id,user_id",
                    [req.body.title, req.body.content, "", req.body.video_url, new Date().toISOString(), values["rows"][0]["id"], req.user.id])
                    .then((values_from_insert) => {
                        return res.send(values_from_insert["rows"]);
                    })
                    .catch(() => {
                        return res.send({ "error": "Something went wrong" })
                    })
            }
        }
        )
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const addSubreddit = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query('SELECT * FROM subreddit WHERE name=$1',
        [req.body.name])
        .then((value) => {
            if (value["rows"].length === 0) {
                client.query("INSERT INTO subreddit (name,description) VALUES ($1,$2) RETURNING id,name,description",
                    [req.body.name, req.body.description])
                    .then((values_from_insert) => {
                        client.query("INSERT INTO subreddit_moderator (user_id,subreddit_id) VALUES ($1,$2) RETURNING id,user_id,subreddit_id",
                            [req.user.id, values_from_insert["rows"][0]["id"]])
                            .then(() => {
                                return res.send(values_from_insert["rows"]);
                            })
                            .catch(() => {
                                return res.send({ "error": "Something went wrong" })
                            })
                    })
                    .catch(() => {
                        return res.send({ "error": "Something went wrong" })
                    })
            }
            else {
                return res.send({ "response": "Subreddit already exists" })
            }
        })
}

const checkIfModerator = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query("SELECT * FROM subreddit WHERE name=$1",
        [req.params.name])
        .then((id) => {
            client.query("SELECT * FROM subreddit_moderator WHERE user_id=$1 AND subreddit_id=$2",
                [req.user.id, id["rows"][0]["id"]])
                .then((value) => {
                    if (value["rows"].length !== 0) {
                        return res.send({ "ifModerator": true })
                    }
                    else {
                        return res.send({ "ifModerator": false })
                    }
                })
                .catch(() => {
                    return res.send({ "error": "Something went wrong" })
                })
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const checkIfSubscribed = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query("SELECT id FROM subreddit WHERE name=$1",
        [req.params.name])
        .then((id) => {
            client.query("SELECT * FROM subreddit_user WHERE user_id=$1 AND subreddit_id=$2",
                [req.user.id, id["rows"][0]["id"]])
                .then((value) => {
                    if (value["rows"].length !== 0) {
                        return res.send({ "ifJoined": true })
                    }
                    else {
                        return res.send({ "ifJoined": false })
                    }
                })
                .catch(() => {
                    return res.send({ "error": "Something went wrong" })
                })
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const subscribe = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query("SELECT id FROM subreddit WHERE name=$1",
        [req.params.name])
        .then((id) => {
            client.query("SELECT * FROM subreddit_user WHERE user_id=$1 AND subreddit_id=$2",
                [req.user.id, id["rows"][0]["id"]])
                .then((value) => {
                    console.log(value)
                    if (value["rows"].length !== 0) {
                        if (req.body.ifJoined) {
                            return res.send({ "error": "Cannot join joined user" })
                        }
                        else {
                            client.query("DELETE FROM subreddit_user WHERE user_id=$1 AND subreddit_id=$2", [req.user.id, id["rows"][0]["id"]])
                                .then(() => {
                                    return res.send({ "response": "User unjoined" })
                                })
                                .catch(() => {
                                    return res.send({ "error": "Something went wrong" })
                                })
                        }
                    }
                    else {
                        if (req.body.ifJoined) {
                            client.query("INSERT INTO subreddit_user (user_id, subreddit_id) VALUES ($1,$2)", [req.user.id, id["rows"][0]["id"]])
                                .then(() => {
                                    return res.send({ "response": "User joined" })
                                })
                                .catch(() => {
                                    return res.send({ "error": "Something went wrong" })
                                })
                        }
                        else {
                            return res.send({ "error": "Cannot unjoin unjoined user" })
                        }
                    }
                })
                .catch(() => {
                    return res.send({ "error": "Something went wrong" })
                })
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const votes =  (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query("SELECT SUM(vote) FROM post_vote WHERE post_id=$1",
        [req.body.post_id])
        .then((sum) => {
            client.query("SELECT * FROM post_vote WHERE user_id=$1 AND post_id=$2",
                [req.user.id, req.body.post_id])
                .then((value) => {
                    return res.send({ sumVotes: sum["rows"], userVotes: value["rows"] })
                })
                .catch(() => {
                    return res.send({ "error": "Something went wrong" })
                })
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const voting = (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query("SELECT vote FROM post_vote WHERE user_id=$1 AND post_id=$2",
        [req.user.id, req.body.post_id])
        .then((vote) => {
            let empty = 0;
            if (vote["rows"].length === 0) {
                empty = 0;
            }
            else {
                empty = 1;
            }
            if (empty === 1) {
                if (vote["rows"][0]["vote"] === 1 && req.body.voteValue === 1) {
                    return res.send({ "error": "Cannot vote yes twice" })
                }
                else if (vote["rows"][0]["vote"] === 1 && req.body.voteValue === -1) {
                    client.query("UPDATE post_vote SET vote=$1 WHERE user_id=$2 AND post_id=$3",
                        [req.body.voteValue, req.user.id, req.body.post_id])
                        .then(() => {
                            return res.send({ "response": "Vote -1 added" });
                        })
                        .catch(() => {
                            return res.send({ "error": "Something went wrong" })
                        })
                }
                else if (vote["rows"][0]["vote"] === -1 && req.body.voteValue === 1) {
                    client.query("UPDATE post_vote SET vote=$1 WHERE user_id=$2 AND post_id=$3",
                        [req.body.voteValue, req.user.id, req.body.post_id])
                        .then(() => {
                            return res.send({ "response": "Vote 1 added" });
                        })
                        .catch(() => {
                            return res.send({ "error": "Something went wrong" })
                        })
                }
                else if (vote["rows"][0]["vote"] === -1 && req.body.voteValue === -1) {
                    return res.send({ "error": "Cannot vote 'no' twice" })
                }
            }
            else {
                if (req.body.voteValue === 1) {
                    client.query("INSERT INTO post_vote (vote, user_id, post_id) VALUES ($1,$2,$3)",
                        [req.body.voteValue, req.user.id, req.body.post_id])
                        .then(() => {
                            return res.send({ "response": "Vote 1 added(0)" });
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else if (req.body.voteValue === -1) {
                    client.query("INSERT INTO post_vote (vote, user_id, post_id) VALUES ($1,$2,$3)",
                        [req.body.voteValue, req.user.id, req.body.post_id])
                        .then(() => {
                            return res.send({ "response": "Vote -1 added(0)" });
                        })
                        .catch(() => {
                            return res.send({ "error": "Something went wrong" })
                        })
                }
            }
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

const comments =  (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401);
        return res.send({ "error": "Unauthorized" })
    }
    client.query("SELECT * FROM comment WHERE post_id=$1",
        [req.body.post_id])
        .then((values) => {
            return res.send(values["rows"]);
        })
        .catch(() => {
            return res.send({ "error": "Something went wrong" })
        })
}

module.exports = {
    getUser,
    getUserId,
    getUserById,
    register,
    changePassword,
    getSubreddits,
    getSubredditByName,
    getSubredditDescription,
    editSubredditDescription,
    addPost,
    addSubreddit,
    checkIfModerator,
    checkIfSubscribed,
    subscribe,
    votes,
    voting,
    comments
}