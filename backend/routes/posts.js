const router = require("express").Router();
const multer = require("multer");

const minifyanduploadimage = require("../local_modules/minify-and-upload-image");
const authCheck = require("../middleware/check-auth");
const getUserInfo = require("../middleware/get-user-info");

const Post = require("./../models/post");
const User = require("./../models/user");

const mimeTypeMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = mimeTypeMap[file.mimetype];
        let error = new Error('invalid mime type');
        if (isValid) error = null;
        cb(error, 'images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = mimeTypeMap[file.mimetype];
        cb(null, name + '_' + Date.now() + '.' + ext);
    }
})

router.use((r, x, next) => {
    console.log("posts routes reached");
    next();
})



router.post("", authCheck, multer({ storage: storage }).single("imagePath"), async (req, res, next) => {
    try {
        let uploadedImageUrl;
        if (req.file) {
            uploadedImageUrl = await minifyanduploadimage(req.file.path);
        }
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: (req.file ? uploadedImageUrl : null),
            creator: req.userData.userId,
            creatorEmail: req.userData.email,
            creatorUsername: req.userData.username,
            date: new Date(),
            comments: [],
            likes: 0
        });
        post.save().then((response) => {
            res.status(201).send({ message: "post Added Successfully", _id: response._id });
        }).catch(() => {
            res.status(401).json({ message: 'error occured while saving post' })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'interenal server error' });
    }
})


router.get("", getUserInfo, async (req, res) => {
    console.log("get posts reached")
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.currentpage < 1 ? 1 : +req.query.currentpage;
        const posts = await Post.find({}).populate('creator', '_id profileImagePath email username').skip(pageSize * (currentPage - 1)).limit(pageSize);
        const totalPostsCount = await Post.countDocuments();

        //if no logged in user, send posts
        if (!req.userData) {
            return res.send({ posts, totalPostsCount });
        }

        //if logged in user
        const user = await User.findById(req.userData.userId);
        posts.map((post) => {
            post.isLiked = user.postsLiked.includes(post._id);
            return post;
        });
        return res.send({ posts, totalPostsCount });
    } catch (ex) {
        res.json({ message: 'something wrong happend while getting posts' });
    }
});

router.get("/:postId", getUserInfo, async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate('creator', '_id username email profileImagePath').populate('comments.commenter')

    //if no post found with given id
    if (!post) {
        console.log("no post found with this id");
        return res.status(401).json({ message: 'no post found with this id' });
    }

    //if no logged in user
    if (!req.userData) {
        post.isLiked = false;
        return res.send(post);
    }

    //logged in user and post found with gived id
    const user = await User.findById(req.userData.userId);
    if (user.postsLiked.includes(postId)) {
        post.isLiked = true;
    } else {
        post.isLiked = false;
    }
    return res.send(post);
})

router.get("/topthreeposts/:userId", async (req, res) => {
    console.log("top three posts reached")
    const userId = req.params.userId;
    const posts = await Post.find({ creator: userId }).sort({ likes: -1 }).limit(4);
    res.send(posts);
    console.log("posts");
    console.log(posts);
})

router.get("/userposts/:userId", async (req, res) => {
    console.log("user posts reached")
    const userId = req.params.userId;
    const posts = await Post.find({ creator: userId }).populate('creator', '_id username email profileImagePath')
    res.send(posts);
})

router.put("/:postId", authCheck, multer({ storage: storage }).single("imagePath"), async (req, res) => {
    try {
        let uploadedImageUrl;
        if (req.file) {
            uploadedImageUrl = await minifyanduploadimage(req.file.path);
        }
        await Post.updateOne({
            _id: req.params.postId,
            creator: req.userData.userId
        }, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                imagePath: (req.file ? uploadedImageUrl : req.body.imagePath === "null" ? null : req.body.imagePath)
            }
        })
        res.status(200).send({ message: 'post updated successfuly' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error' });
    }
})

router.delete("/:postId", authCheck, (req, res) => {
    Post.deleteOne({ _id: req.params.postId, creator: req.userData.userId }).then((deletedPost) => {
        res.status(200).send({ id: req.params.postId });
    });
})


router.post("/like/:postId", authCheck, (req, res) => {
    const postId = req.params.postId
    Post.findById(postId).then((post) => {
        if (!post) return res.status(401).json({ message: 'no post found' });
        User.findById(req.userData.userId).then((user) => {
            if (!user.postsLiked.includes(postId)) {
                user.postsLiked.push(postId);
                post.likes++;
                user.save();
                post.save();
            } else {
                return res.status(401).json({ message: 'user already liked the post' });
            }
        })
        return res.json({ message: 'like added successfully' });
    })
})

router.post("/unlike/:postId", authCheck, (req, res) => {
    const postId = req.params.postId
    Post.findById(postId).then((post) => {
        if (!post) return res.status(401).json({ message: 'no post found' });
        User.findById(req.userData.userId).then((user) => {
            if (user.postsLiked.includes(postId)) {
                const unlikedPostIndex = user.postsLiked.findIndex(id => id === postId)
                user.postsLiked.splice(unlikedPostIndex, 1);
                post.likes--;
                user.save();
                post.save();
            } else {
                return res.status(401).json({ message: "user didn't liked the post" });
            }
        })
        return res.json({ message: 'liked removed successfully' });
    })
})

module.exports = router;