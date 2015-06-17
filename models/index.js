var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/reddit_app");
mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Post = require("./posts");
module.exports.Comment = require("./comments");
