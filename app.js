var express     = require("express"), 
    mongoose    = require("mongoose"), 
    bodyParser  = require("body-parser"), 
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    LocalStrategy = require("passport-local") ,
    passport = require("passport") ,
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override"),
    flash       = require("connect-flash"),
    app         = express();
    
    // acquire all routes
var commentRoutes = require("./routes/comments") ,
    campgroundRoutes = require("./routes/campgrounds") ,
    indexRoutes     = require("./routes/index");
    
// executes this function which deletes everything out of the DB
//seedDB();

// use the override method
app.use(methodOverride("_method"));

app.use(require("express-session")({
    // pass in three options to work with passport
    // secret will be used to decode the information used in the session. Can be anything
    secret: "Rusty is the best and cutest dog in the world" , 
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// create new local strategy using User.authenticate method coming from passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));

// Responsible for reading session and taking data from session and encoding it back into the session(These come from passport package)
passport.serializeUser(User.serializeUser());

// Responsbile for reading session and taking data from session and deencoding it 
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB and create DB with name of yelp_camp
// mongodb://localhost/yelp_camp_v4
// mongoose.connect(process.env.DATABASEURL);

//console.log(process.env.DATABASEURL);

// Connect to MongoLab Database
mongoose.connect("mongodb://jbrooks0078:Falcons001@ds159164.mlab.com:59164/yelpcamp");

// allows to set up for use of passport
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// imports the main custom stylesheet. Dirname is always the directory that the script lives in. Must link to it in the header file
app.use(express.static(__dirname + "/public"));

// middleware that runs for every single route 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// use the routes

app.use("/", indexRoutes);
// all campground routes should start with /campgrounds
app.use("/campgrounds", campgroundRoutes);
// all comment routes start with
app.use("/campgrounds/:id/comments" , commentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Yelp Camp Server has started");
});