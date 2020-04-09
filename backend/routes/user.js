const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const nodemailer = require("nodemailer");
require("dotenv").config();

const User = require("./../models/user");


const authCheck = require('../middleware/check-auth');
const minifyanduploadimage = require("../local_modules/minify-and-upload-image");

const mimeTypeMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const frontendURL = 'https://mohamed-fawzy7.github.io/myblog/';

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


router.patch("/:userId", authCheck, multer({ storage }).single("mo"), async (req, res) => {
    try {
        const userId = req.userData.userId;
        if (userId !== req.params.userId) return res.status(400).json({ message: 'bad request' });

        let uploadedImageUrl;
        if (req.file) uploadedImageUrl = await minifyanduploadimage(req.file.path);

        const user = await User.findById(userId)
        user.username = req.body.username;
        user.bio = req.body.bio;
        user.profileImagePath = (req.file ? uploadedImageUrl : user.profileImagePath);
        await user.save();
        res.json({ message: 'user data updated successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
    }
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})



function sendEmailConfirmation(userId, userEmail) {
    return new Promise((resolve, reject) => {
        const emailToken = jwt.sign({ _id: userId }, process.env.JWT_EMAIL_KEY, { expiresIn: '10m' });
        console.log(emailToken);
        const URL = frontendURL + 'account/email-confirmation/' + emailToken;

        const mailOptions = {
            from: '"Myblog" weblog777755@gmail.com',
            to: userEmail,
            subject: 'Verify Your Email',
            html: `please click this link <a href='${URL}'>${URL}</a>`
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (!err) {
                resolve({ error: err })
            } else {
                reject({ result: data });
            }
        })
    })
}


router.post("/sendresetpasswordemail", (req, res) => {
    console.log(req.body.email);
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(400).json({ message: "This email isn't registered" })
        }
        const resetPasswordToken = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD_KEY, { expiresIn: '3h' });
        const URL = frontendURL + 'password_reset/' + resetPasswordToken;
        const mailOptions = {
            from: '"Myblog" weblog777755@gmail.com',
            to: req.body.email,
            subject: 'Reset password',
            html: `
            We have received a request to reset your MyBlog account
            To reset your password, please click the link. This will take you to a page where you reset your password.
            <a href='${URL}'>${URL}</a>
            
            If you did not request this password reset email, please make sure you secure your account and computer.
            `
        }
        transporter.sendMail(mailOptions, (err, data) => {
            if (!err) {
                res.send({ message: 'reset password email sent.' });
            } else {
                res.status(500).json({ message: 'internal server error' });
            }
        })
    })
});

router.post("/checkpasswordtokenValidity", (req, res) => {
    try {
        const token = req.body.token;
        const password = req.body.password;
        jwt.verify(token, process.env.JWT_RESET_PASSWORD_KEY);
        res.send({message: 'valid token'});
    } catch (ex) {
        res.status(400).send({message: 'invalid token'});
    }
});

router.post("/changepassword", async (req, res) => {
    try {
        const token = req.body.token;
        const password = req.body.password;
        const userData = jwt.verify(token, process.env.JWT_RESET_PASSWORD_KEY);
        console.log(userData, password, token);
        const hashedPass = await bcrypt.hash(password, 10);
        const user = await User.findById(userData._id);
        user.password = hashedPass;
        await user.save();
        console.log("we are here");
        res.json({message: 'password changed successfully'});
    } catch (ex) {
        res.status(400).send({message: 'invalid token'});
    }
});


router.post("/resendemailconfirmation", authCheck, async (req, res) => {
    sendEmailConfirmation(req.userData.userId, req.userData.email).then(() => {
        res.json({ message: 'email sent' });
    }).catch(() => {
        res.status(500).send({ message: 'interenal server error', errorName: 'interenalServerError' });
    })
});

router.post("/signup", (req, res) => {
    User.findOne({ email: req.body.email.toLowerCase() }).then((user) => {
        if (user) {
            return res.json({ usedEmail: true })
        } else {
            bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    email: req.body.email.toLowerCase(),
                    username: req.body.username,
                    password: hash,
                    bio: null,
                    profileImagePath: null,
                    isEmailVerified: false
                });
                user.save().then((result) => {
                    sendEmailConfirmation(user._id, user.email);
                    res.status(201).json({
                        message: 'user created successfully'
                    })
                }).catch(err => {
                    console.log(err);
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
    console.log(req.body);
    if (!req.body.email || !req.body.password) return res.status(400).json({ message: 'no email or password provided' })
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
                username: fetchedUser.username,
                isEmailVerified: fetchedUser.isEmailVerified,
                email: fetchedUser.email
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

router.get("/getemail", authCheck, (req, res) => {
    const user = User.findById(req.userData.userId).select('email isEmailVerified').then((data) => {
        if (!user) return res.status(400).json({ message: 'no user!' });
        res.json(data);
    })
});

router.post("/confirmemail", authCheck, async (req, res) => {
    try {
        const emailTokenData = jwt.verify(req.body.token, process.env.JWT_EMAIL_KEY);
        if (emailTokenData._id === req.userData.userId) {
            console.log("successful email confirmation");
            const user = await User.findById(emailTokenData._id);
            console.log(user);
            user.isEmailVerified = true;
            user.save();
            return res.json({ message: 'email confirmed successfully' });
        } else {
            console.log("email verification failed, user id and email token user id don't match");
            throw new Error("user ids don't match");
        }
    } catch (ex) {
        console.log(ex);
        if (ex.name === 'TokenExpiredError') {
            res.status(400).send({ message: 'token expired', errorName: 'TokenExpiredError' });
        } else {
            res.status(500).send({ message: 'interenal server error', errorName: 'interenalServerError' });
        }
    }
});

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    const user = await User.findById(userId);
    res.json({ username: user.username, bio: user.bio, profileImagePath: user.profileImagePath, _id: user._id });
})



module.exports = router;