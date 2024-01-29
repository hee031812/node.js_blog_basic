const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    postNum: Number
}, { collection: "counter" });

const Counter = mongoose.model("Counter", postSchema);

module.exports = { Counter };