// Create campgrounds and comments

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [
    {   name: "Cloud's Rest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0dSmbRZcGfHATZI-p5ZBpPeDBn7maobAda4PwY2_nq3C-dpuxXg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean hendrerit magna enim, nec dignissim eros pharetra id. Fusce molestie lorem nec vulputate facilisis. Quisque risus tortor, luctus in nunc quis, vehicula auctor justo. Morbi at lorem accumsan, sollicitudin ex eget, suscipit felis. Nunc ut ligula et lacus ullamcorper porttitor nec ut augue. Proin faucibus commodo orci sed euismod. Quisque egestas nibh tortor, non molestie magna ornare pulvinar. Maecenas nec diam turpis."
    },
    {   name: "Cloud's Rest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0dSmbRZcGfHATZI-p5ZBpPeDBn7maobAda4PwY2_nq3C-dpuxXg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean hendrerit magna enim, nec dignissim eros pharetra id. Fusce molestie lorem nec vulputate facilisis. Quisque risus tortor, luctus in nunc quis, vehicula auctor justo. Morbi at lorem accumsan, sollicitudin ex eget, suscipit felis. Nunc ut ligula et lacus ullamcorper porttitor nec ut augue. Proin faucibus commodo orci sed euismod. Quisque egestas nibh tortor, non molestie magna ornare pulvinar. Maecenas nec diam turpis."
    },
    {   name: "Cloud's Rest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0dSmbRZcGfHATZI-p5ZBpPeDBn7maobAda4PwY2_nq3C-dpuxXg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean hendrerit magna enim, nec dignissim eros pharetra id. Fusce molestie lorem nec vulputate facilisis. Quisque risus tortor, luctus in nunc quis, vehicula auctor justo. Morbi at lorem accumsan, sollicitudin ex eget, suscipit felis. Nunc ut ligula et lacus ullamcorper porttitor nec ut augue. Proin faucibus commodo orci sed euismod. Quisque egestas nibh tortor, non molestie magna ornare pulvinar. Maecenas nec diam turpis."
    }
    ]

function seedDB(){
    // delete all campgrounds out of the DB
    Campground.remove({}, function(err){
        /*
    if(err){
        console.log(err);
    } else {
    console.log("removed campgrounds");
    }
    // add a few campgrounds
    data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            } else {
                console.log("added a campground");
                //for each campground create a commment. Each campground will have the same comment
                Comment.create(
                {
                    text: "This place is greate but i wish there was internet" ,
                    author: "Homer"
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    } else {
                        // associate comment with campground and push into comments array
                         campground.comments.push(comment);
                         campground.save();
                         console.log("New comment created");
                    }
                });
            }
        });
    });
    */
});
   // add a few comments

}

module.exports = seedDB;

