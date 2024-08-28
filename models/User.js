const mongoose = require('mongoose');
const validator = require('validator');
const NewsArticle = require("./News")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "Please enter your name."]
    },
    email : {
        type : String,
        required : [true, "Please enter your email"],
        unique : true,
        validate :  validator.isEmail
    },
    password : {
        type : String,
        minLength : [8, "Password must be at least 8 characters long."],
    }, 
    profilePicture : {
        public_id :String,
        url : String, 
    },
    saveList  : [{
        articleId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "NewsArticle",
            required : true
        },
        headline : String,
        description : String,
        image : {
            public_id : String,
            url : String,
        },
    }],
    viewedArticles : [
        {
            articleId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "NewsArticle",
            }
        }
    ],
    createdAt : {
        type : Date,
        immutable : true,
        default : ()=> Date.now()
    },
    updatedAt : {
        type : Date,
        default : ()=> Date.now()
    },
});

// Create a model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;