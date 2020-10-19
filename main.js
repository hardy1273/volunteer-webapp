var express=require('express');
var app=express();
var request=require('axios');
var bodyParser= require("body-parser");
var mongoose=require("mongoose");
var flash=require('connect-flash');
var Campground=require("./models/campground")
var Comment=require("./models/comment")
var seedDB=require("./seeds")
var passport=require("passport")
var LocalStrategy=require("passport-local")
var User=require("./models/user.js")
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campground");
var authRoutes=require("./routes/index");
var methodOverride=require("method-override");
const session=require("express-session")
const MongoStore = require('connect-mongo')(session);
var dbUrl=process.env.DB_URL
require('dotenv').config()



app.use(methodOverride("_method"));

app.use(express.static(__dirname+"/public"))



//seedDB()

app.use(flash());

var store= new MongoStore({
    url:dbUrl,
    secret:"merahogyahai",
    touchAfter:24 * 60 * 60
})

store.on("error",function(e){
    console.log("error is",e)
})
app.use(require("express-session")({
    store,
    secret:"BRUHHHHHHHHHHHHHHHHHH",
    resave:false,
    saveUninitialized:false
}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next ){
    res.locals.currentUser= req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})

//mongodb://localhost:27017/makespp


mongoose.Promise=global.Promise;
mongoose.connect(dbUrl, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine","ejs");



app.use("/",authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(3000 || process.env.PORT,function(){
    console.log("Server Started on Port 3000...");
});