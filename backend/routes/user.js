const router = require("express").Router();
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const authCheck  = require('../middleware/check-auth');

const mimeTypeMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = mimeTypeMap[file.mimetype];
        let error = null;
        if (!isValid) error = new Error('invalid mime type');
        cb(error, 'images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = mimeTypeMap[file.mimetype];
        cb(null, name + '_' + Date.now() + '.' + ext);
    }
})


router.patch("/:userId", authCheck, multer({storage}).single("mo"), async (req, res) => {  
    const userId = req.userData.userId;
    if(userId !== req.params.userId){
        return res.status(400).json({message: 'bad request'});
    }
    const user = await User.findById(userId)
    user.username = req.body.username;
    user.bio = req.body.bio;
    user.profileImagePath = (req.file ? req.file.filename : user.profileImagePath);
    await user.save();
    res.json({message: 'user data updated successfully'})
})


router.post("/signup", (req, res) => {
    User.findOne({ email: req.body.email.toLowerCase() }).then((user) => {
        if (user) {
            return res.json({ usedEmail: true })
        } else {
            bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    email: req.body.email,
                    username: req.body.username.toLowerCase(),
                    password: hash,
                    bio: null,
                    profileImagePath: null
                });
                user.save().then((result) => {
                    res.status(201).json({
                        message: 'user created successfully',
                        result: result
                    })
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
            })
        }
    })
});

router.post("/login", (req, res) => {
    let fetchedUser;
    User.findOne({ email: req.body.email.toLowerCase() }).then((user) => {
        if (!user) {
            throw new Error("wrongEmailOrPassword");
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, fetchedUser.password);  //promise, regular password is first param, hashed is 2nd
    })
        .then((result) => {
            if (!result) {
                throw new Error("wrongEmailOrPassword");
            }
            const token = jwt.sign({
                email: fetchedUser.email,
                id: fetchedUser._id,
                username: fetchedUser.username
            }, process.env.JWT_KEY, { expiresIn: '1h' });
            res.status(201).json({
                token,
                expiresIn: 3600,
                userId: fetchedUser._id.toString(),
                username: fetchedUser.username
            });
        })
        .catch((err) => {
            if (err.message === 'wrongEmailOrPassword') {
                return res.status(401).json({
                    message: 'Auth failed',
                    wrongEmailOrPassword: true
                });
            }
            return res.status(401).json({
                message: 'something failed while authenticating'
            })
        })
})

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    const user = await User.findById(userId);
    res.json({ username: user.username, bio: user.bio, profileImagePath: user.profileImagePath, _id: user._id });
})

module.exports = router;