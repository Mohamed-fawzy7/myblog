const router = require("express").Router();
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res)=> {
    User.findOne({email: req.body.email}).then((user)=>{
        if (user){
            return res.json({usedEmail: true})
        } else {
            bcrypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save().then((result)=>{
                    res.status(201).json({
                        message: 'user created successfully',
                        result: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
            })
        }
    })
});

router.post("/login", (req, res)=> {
    let fetchedUser;
    User.findOne({email: req.body.email}).then((user)=>{
        if (!user){
            throw new Error("wrongEmailOrPassword");
        }
        console.log("dont log that")
        fetchedUser = user;
        return bcrypt.compare(req.body.password, fetchedUser.password);  //promise regular password is first param, hashed is 2nd
    })
    .then((result)=>{
        console.log("dont log that also");
        if (!result){
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        const token = jwt.sign({email: fetchedUser.email, id: fetchedUser._id}, process.env.JWT_KEY, {expiresIn: '1h'});
        res.status(201).json({
            token,
            expiresIn: 3600,
            userId: fetchedUser._id.toString()
        });
    })
    .catch((err)=>{
        if (err.message === 'wrongEmailOrPassword'){
            return res.status(401).json({
                message: 'Auth failed',
                wrongEmailOrPassword: true
            });
        }
        return res.status(401).json({
            message: 'Auth failed'
        })
    })
})

module.exports = router;