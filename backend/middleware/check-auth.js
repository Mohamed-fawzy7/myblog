const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization;
        const decordedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {email: decordedToken.email, userId: decordedToken.id, username: decordedToken.username}
        next();
    } catch (ex){
        console.log("my ", ex.message);
        res.status(401).json({
            error: 'Auth Failed'
        })
    }
}