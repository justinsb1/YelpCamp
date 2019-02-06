var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
            // does user own the campground
                Campground.findById(req.params.id, function(err, foundCampground){
                    if(err || !foundCampground){
                        // if not logged in go here
                        req.flash("error", "Campground not found");
                        res.redirect("back");
                    } else {
                        // does user own the campground? cant compare string to object so have to use mongoose built in 
                        if(foundCampground.author.id.equals(req.user._id)){
                            // move on to the rest of the code
                             next();
                        } else  { 
                            // if they dont own it
                            req.flash("error", "You don't have permission to do that!");
                            res.redirect("back");
                        }
                    }
                });
        } else {
            // takes the user back where they came from
            req.flash("error", "You have to be logged in to do that");
            res.redirect("back");
        }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            // does user own the campground
                Comment.findById(req.params.comment_id, function(err, foundComment){
                    if(err || !foundComment){
                        // if not logged in go here
                        req.flash("error", "Comment not found");
                        res.redirect("back");
                    } else {
                        // does user own the comment? cant compare string to object so have to use mongoose built in 
                        if(foundComment.author.id.equals(req.user._id)){
                            // move on to the rest of the code
                             next();
                        } else  { 
                            // if they dont own it
                            req.flash("error", "You don't have permission to do that!");
                            res.redirect("back");
                        }
                    }
                });
        } else {
            //if user is not logged in
            req.flash("error", "You need to be logged in to do that");
            // takes the user back where they came from
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function(req, res, next){
    
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
    
}


  

  
  middlewareObj.isSafe = function(req, res, next) {
    if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
      next();
    }else {
      req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
      res.redirect('back');
    }
}





// middlewareObj is a variable that contains all methods
module.exports = middlewareObj;