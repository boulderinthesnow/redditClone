var mongoose = require("mongoose");
var Post = require("./post");
var Comment = require("./comment");

var userSchema = new mongoose.Schema({
                    name: {type: String, required: true}            
                    password: {type: String, required: true}
                    posts: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Post"
                    }]
                    comments: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Comment"
                    }]

                  });

userSchema.pre('remove', function(next) {
	var user = this
   Post.remove({user: user._id}).exec();
   Comment.remove({user: user._id}).exec();
   // TODO --- HOW DO WE REMOVE COMMENTS FROM MULTIPLE USERS ONCE A POST IS REMOVED
   next();
});

var User = mongoose.model("User", userSchema);
module.exports = User;