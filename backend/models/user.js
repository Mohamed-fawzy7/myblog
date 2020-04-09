const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
    postsLiked: {type: [{type: mongoose.Schema.Types.ObjectId}], ref: 'Post'},
    profileImagePath: {type: String},
    bio: {type: String},
    isEmailVerified: {type: Boolean, required: true}
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);