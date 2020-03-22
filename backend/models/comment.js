const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentText: {type: String, required: true},
    postId: {type: mongoose.Schema.Types.ObjectId, required: true},
    commenter: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Date, required: true}
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports.commentSchema = commentSchema;
module.exports.Comment = Comment;