const router = require("express").Router();
const Post = require("./../models/post");
const Comment = require("./../models/comment");
const authCheck = require("../middleware/check-auth");

router.post("", authCheck, (req, res)=>{
    console.log(req.body);
    Post.findById(req.body.postId).then((post)=>{
        if(!post){ throw new Error('post not found'); }
        const newComment = new Comment({
            commentText: req.body.comment,
            postId: req.body.postId,
            commenterId: req.userData.userId,
            commenterEmail: req.userData.email
        })
        newComment.save().then((comment)=>{
            Post.findById(req.body.postId).then((post)=>{
                post.comments.push(newComment);
                post.save().then((post)=>{
                    res.json({message: 'comment added successfully'});
                    console.log(post);
                })
            })
        })
    }).catch(()=>{
        console.log("err cant find post")
    })
})
module.exports = router;