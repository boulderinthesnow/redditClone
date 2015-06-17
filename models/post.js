var mongoose = require("mongoose");
var Comment = require("./comment");

var postSchema = new mongoose.Schema({
                    title: {type: String, required: true}            
                    body: {type: String, required: true}
                    user: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"
                    }
                    comments: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Comment"
                    }]

                  });

postSchema.pre('remove', function(next) {
  var post = this
   Comment.remove({post: post._id}).exec();
   next();
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;