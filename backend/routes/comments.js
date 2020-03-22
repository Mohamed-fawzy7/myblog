const router = require("express").Router();
const Post = require("./../models/post");
const { Comment } = require("./../models/comment");
const authCheck = require("../middleware/check-auth");


router.delete("/:commentId/:postId", authCheck, async (req, res) => {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(400).json({ message:'failed to find post, might be deleted'});
    const commentIndex = post.comments.findIndex(c => c._id.toString() === req.params.commentId && req.userData.userId === c.commenter._id.toString())
    if (commentIndex >= 0) {
        post.comments.splice(commentIndex, 1);
        post.save();
        res.json({ message: 'comment deleted successfully' });
    } else {
        return res.status(400).json({ message: 'no comment found' })
    }
})

router.post("", authCheck, async (req, res) => {
    try {
        const postId = req.body.postId; 
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ message:'failed to find post, might be deleted'});
        const newComment = new Comment({
            commentText: req.body.comment,
            postId: req.body.postId,
            commenter: req.userData.userId,
            date: new Date()
        })
        post.comments.push(newComment);
        await post.save();
        res.json({ message: 'comment added successfully' });
    } catch (ex){
        console.log(ex);
        res.status(500).json({ message: 'failed to add comment' });
    }
})

router.patch("/:commentId/:postId", authCheck, async (req, res) => {
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    const commentIndex = post.comments.findIndex(comment => {
        return comment._id.toString() === commentId && comment.commenter._id.toString() === req.userData.userId
    });
    console.log(commentIndex);
    if (commentIndex > -1) {
        post.comments[commentIndex].commentText = req.body.editedComment
        console.log(post);
        post.save().then(() => {
            console.log("post saved")
            res.json({ message: 'comment edited successfully' });
        })
    } else {
        res.status(400).json({ message: 'failed to edit comment' });
    }
});
module.exports = router;

