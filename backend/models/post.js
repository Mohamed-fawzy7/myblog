const mongoose = require("mongoose");
const { commentSchema }= require("./comment");
const postSchema = new mongoose.Schema({
    title: {required: true, type: String},
    content: {required: true, type: String},
    imagePath: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, // not tested yet
    date: {type: Date, required: true},
    comments: [commentSchema],
    likes: {type: Number, required: true},
    isLiked: Boolean
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;