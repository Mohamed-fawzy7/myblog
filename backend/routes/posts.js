const router = require("express").Router();
const multer = require("multer");

const Post = require("./../models/post");
const authCheck = require("../middleware/check-auth");

const mimeTypeMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    
    destination: (req, file, cb)=> {
        const isValid = mimeTypeMap[file.mimetype];
        let error = new Error('invalid mime type');
        if (isValid) error = null;
        cb(error, 'backend/images');
    },
    filename: (req, file, cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = mimeTypeMap[file.mimetype];
        cb(null, name + '_' + Date.now() + '.' + ext);
    }
})

router.get("", (req, res)=> {
    const pageSize = +req.query.pagesize;    
    const currentPage = +req.query.currentpage < 1 ? 1: +req.query.currentpage;
    console.log(currentPage);
    let fetchedPosts = [];
    Post.find({}).skip(pageSize * (currentPage - 1)).limit(pageSize)
        .then((posts)=>{
            console.log("we in get")
            fetchedPosts = posts;
            return Post.countDocuments();
        })
		.then((totalPostsCount)=>{
			res.send({posts: fetchedPosts, totalPostsCount});
		})
		.catch((err)=>{
            console.log(err);
			console.log("error occured at while getting posts");
		});
})

router.get("/:id", (req, res)=> {
	Post.findOne({_id: req.params.id})
		.then((post)=>{
			res.send(post);
		})
		.catch(()=>{
			console.log("error occured at while getting post");
		});
})

router.post("", authCheck, multer({storage: storage}).single("imagePath"), (req, res, next)=> {
    console.log("post reached");
    console.log(req.body.title);
    const post = new Post({
		title: req.body.title,
        content: req.body.content,
        imagePath: (req.file? req.file.filename : null),
        creator: req.userData.userId,
        creatorEmail: req.userData.email,
        comments: []
    });
	post.save().then((response)=>{
		res.status(201).send({message: "post Added Successfully", _id: response._id});
	})
})

router.put("/:id", authCheck, multer({storage: storage}).single("imagePath"), (req, res)=>{
    console.log("73", typeof req.body.imagePath);
	Post.updateOne({_id: req.params.id, creator: req.userData.userId}, {
        $set: {    
            title: req.body.title,
            content: req.body.content,
            imagePath: (req.file? req.file.filename : req.body.imagePath === "null"? null : req.body.imagePath)
        }
	}).then((post)=>{
		res.status(200).send({message: 'post updated successfuly'});
	});
})

router.delete("/:id", authCheck,(req, res)=>{
	Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((deletedPost)=>{
		res.status(200).send({id: req.params.id});
	});
})

module.exports = router;