var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//back out one directory up into v10 and go into middleware
//don't have to put index.js at the end because index.js is a special file that is automatically required
var middleware = require("../middleware");

//allow you to add all routes on instead of using app.get, etc.
var router = express.Router();

// INDEX -  SHOWS ALL THE CAMPGROUNDS FROM THE DB
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
                        // Renders campgrounds file and expect to be named campgrounds and take allCampgrounds that came back and send them back to the campgrounds file
                        // currentUser contains information about user logged in
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE - ADD NEW CAMPGROUNDS TO THE DB
router.post("/", middleware.isLoggedIn , function(req, res){
    // Get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    // create new object for the users name
    var author = {
        id: req.user._id ,
        username: req.user.username
    }
    // pass author object into the newCampground object to associate the user with the campground ex. submitted by
    var newCampground = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB , newlyCreated is coming back from the database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            // WHAT HAPPENS IF USER ENTERS INVALID NEW CAMPGROUND
            console.log("ERROR");
        } else {
            // IF VALID CAMPGROUND WAS ENTERED GO BACK TO CAMPGROUNDS
            res.redirect("/campgrounds");
        }
    }); 
});

// NEW - PAGE TO CREATE CAMPGROUNDS THAT SENDS DATA TO THE CREATE ROUTE
router.get("/new", middleware.isLoggedIn , function(req, res){
    res.render("campgrounds/new");
});

// SHOW - SHOW INFORMATION ABOUT ONE CAMPGROUND . campground/anything
router.get("/:id", function(req, res){
    // Find the cmapgorund with provided ID and then populate the comment on that campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            console.log(foundCampground);
            // Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
            Campground.findById(req.params.id, function(err, foundCampground){
                // does user own the campground? cant compare string to object so have to use mongoose built in  (.equals()
                res.render("campgrounds/edit", {campground: foundCampground});
    });
});



// UPDATE CAMPGROUND ROUTE - where the edit form sends too , put is for sending data
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground , first arg is what were looking for , second arg is the data we want to update
    // want to update name, image, descritpipon so instead of making a new object. went to edit page and wrapped them in campground[]
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            // go back to that specific campground page 
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DELETE/DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // delete the campground
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});





// export it out
module.exports = router;
