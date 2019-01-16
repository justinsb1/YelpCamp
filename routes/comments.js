var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ==============
// COMMENTS ROUTE  // has isLoggedIn as a middleware so if user is not logged in , will not allow them to post a comment
// ==============

router.get("/new", middleware.isLoggedIn , function(req, res){
    //define campground by id so it can be used in the new template
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            // Render new comment template with that comment from campground model
            res.render("comments/new", {campground: campground});
        }
    })
});

// POST ROUTE - CREATE
router.post("/", middleware.isLoggedIn , function(req, res){
    
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment and then save comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username;
                    comment.save();
                    // Connect comment to new campground
                    campground.comments.push(comment);
                    campground.save();
                    // Redirect show page
                    req.flash("success", "Successfully created comment");
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
});

// Edit Comment Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    //this guards against someone trying to break the app by putting in a fake camp id into the url
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground)
        {
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
    // lookup the comment 
    Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err)
            {
                res.redirect("back");
            } 
            else 
            {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    })
});

// COMMENT UPDATE ROUTE - put request to campground
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            // req.params.id is the campground id from app.js file
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove by comment
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});






module.exports = router;