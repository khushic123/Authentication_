//jshint esversion:
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
mongoose.connect('mongodb://localhost:27017/usersDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const usersSchema = new mongoose.Schema({
    Email: String,
    Password: String,
  });
  
   usersSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['Password']});
  
  const User= mongoose.model('User', usersSchema);
  

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
      res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
       const email=req.body.username;
       const pass=req.body.password;
       const newuser=new User(
           {
               Email:email,
               Password: pass,
           }
       )
       newuser.save(function(err){
                if(err)
                console.log(err);
                else
                {
                console.log("New user saved successfully");
                res.render("secrets");
                }

    });
});

app.post("/login",function(req,res){
    const email=req.body.username;
    const pass=req.body.password;
    User.findOne({Email:email},function(err,foundeduser){
            if(err)
            res.send(err);
            else
            {
                if(foundeduser)
                {
                    if(foundeduser.Password==pass)
                    {
                    console.log("user logged in");
                    res.render("secrets");
                    }
                }
            }
            
    });
});




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });