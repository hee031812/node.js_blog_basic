const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 5050;

app.use(express.static(path.join(__dirname, "../client/build")));
app.use("/image", express.static("./image"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/post/", require("./Router/post.js"))


app.listen(port, () => {
    mongoose.connect(
        'mongodb+srv://hee031812:hee031812@cluster0.rxihsko.mongodb.net/reactblog?retryWrites=true&w=majority'
    ).then(() => {
        console.log("listening  --> " + port);
        console.log("mongoose connecting...");
    })
        .catch((err) => {
            console.log(err)
        })
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
})
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

