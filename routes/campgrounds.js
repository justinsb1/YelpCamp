var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//back out one directory up into v10 and go into middleware
//don't have to put index.js at the end because index.js is a special file that is automatically required
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");

// require node-geocoder
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

//allow you to add all routes on instead of using app.get, etc.
var router = express.Router();



// Search function
// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all campgrounds
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Campground.find({name: regex}, function(err, allCampgrounds){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allCampgrounds);
         }
      });
  } else {
      // Get all campgrounds from DB
      Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allCampgrounds);
            } else {
              res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
            }
         }
      });
  }
});

// CREATE - ADD NEW CAMPGROUNDS TO THE DB
router.post("/", middleware.isLoggedIn , middleware.isSafe , function(req, res){
    // Get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    
    
    // create new object for the users name
    var author = {
        id: req.user._id ,
        username: req.user.username
    }
    
   geocoder.geocode(req.body.location, function (err, data) {
    if (err || data.status === "ZERO_RESULTS") {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    
    // pass author object into the newCampground object to associate the user with the campground ex. submitted by
    var newCampground = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB , newlyCreated is coming back from the database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            // WHAT HAPPENS IF USER ENTERS INVALID NEW CAMPGROUND
            console.log("ERROR");
        } else {
            // IF VALID CAMPGROUND WAS ENTERED GO BACK TO CAMPGROUNDS
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    }); 
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
                if(err) {
                    console.log(err);
                } else {
                    // render show template with that campground
                    res.render("campgrounds/edit", {campground: foundCampground});
                }
                if(err || foundCampground == undefined){
                    console.log(err);
                    req.flash('error', 'Sorry, that campground does not exists!');
                    return res.redirect('/campgrounds');
                }
                res.render("campgrounds/edit", {campground: foundCampground});
            });
    });




// UPDATE CAMPGROUND ROUTE - where the edit form sends too , put is for sending data
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    
    // find and update the correct campground , first arg is what were looking for , second arg is the data we want to update
    // want to update name, image, descritpipon so instead of making a new object. went to edit page and wrapped them in campground[]
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            // go back to that specific campground page 
            req.flash("success", "Sucessfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
    });
});


// DELETE - removes campground and its comments from the database
router.delete("/:id", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
    Comment.remove({
      _id: {
        $in: req.campground.comments
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.campground.remove(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'Campground deleted!');
            res.redirect('/campgrounds');
          });
      }
    })
});




// export it out
module.exports = router;
