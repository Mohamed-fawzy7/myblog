const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {required: true, type: String},
    content: {required: true, type: String},
    imagePath: String,
    creator: {type: String, ref: "User", required: true},
    creatorEmail: {type: String, required: true },
    comments: {type: Array}
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;