const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentText: {type: String, required: true},
    postId: {type: mongoose.Schema.Types.ObjectId, required: true},
    commenterId: {type: mongoose.Schema.Types.ObjectId, required: true},
    commenterEmail: {type: String, required: true}
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;