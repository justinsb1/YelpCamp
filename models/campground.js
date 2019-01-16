var mongoose = require("mongoose");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    // create author object
    author: {
             id: {
                 type: mongoose.Schema.Types.ObjectId ,
                 ref: "User"
        } ,
    
    username: String, 
    },  
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
});

//Compile to a model
module.exports = mongoose.model("Campground", campgroundSchema);
