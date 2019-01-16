var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    // add author as an object so you access it in comments
    author: {
        id:  {
            // reference to a user model id
            type: mongoose.Schema.Types.ObjectId ,
            // ref refers to the models we are refering to
            ref: "User"
        } ,
        username: String
    }
});


// creates comment model
module.exports = mongoose.model("Comment", commentSchema);