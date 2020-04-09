const express = require("express");
const app = express();
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");

const dbLink = "mongodb+srv://Fawzy:" + process.env.MONGO_ATLAS_PW + "@myblog-risj0.mongodb.net/blogdb?retryWrites=true&w=majority";
mongoose.connect(dbLink, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log("connected to db");
}).catch(() => {
    console.log("failed to connect to db");
});

mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
})

app.use(express.json());

app.use((req, res, next) => {
    if(req.method === 'OPTIONS'){
        return res.status(200).send('');
    }
    console.log("url", req.url, "method", req.method)
    next();
})

// app.use("/images", express.static(path.join("images")));


app.use("/api/user", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);


module.exports = app;