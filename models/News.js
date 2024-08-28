const mongoose = require('mongoose');

// Define the schema for the news article
const newsArticleSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true
  },
  thumbnail: {
    url : {
      type : String,
      required :  true, 
    }, 
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  views : {
    type : Number,
    default : 0
  },
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
const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);

module.exports = NewsArticle;