const client = require('./config');

module.exports = function(io){
    io.sockets.on("connection", (socket) => {
        socket.on('deleteComment', (comment) => {
            client.query('DELETE FROM comment WHERE id=$1 RETURNING id,content,user_id,post_id', [comment.comment_id])
                .then(() => {
                    io.emit("deletedComment", comment)
                })
        })
        socket.on('deletePost', (post) => {
            client.query('DELETE FROM post_vote WHERE post_id=$1', [post.post_id])
                .then(() => {
                    client.query('DELETE FROM comment WHERE post_id=$1', [post.post_id])
                        .then(() => {
                            client.query('DELETE FROM post WHERE id=$1', [post.post_id])
                                .then(() => {
                                    io.emit("deletedPost", post.post_id)
                                })
                        })
                })
        })
        socket.on('addComment', (comment) => {
            client.query('INSERT INTO comment (content,user_id,post_id) VALUES ($1,$2,$3) RETURNING id,content,user_id,post_id', [comment["content"], comment["user_id"], comment["post_id"]])
                .then((data) => {
                    io.emit("addedComment", data.rows[0])
                })
                .catch(() => {
                })
        })
    })
}
