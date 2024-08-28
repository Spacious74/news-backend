const NewsArticle = require('../models/News');
const cloudinary = require('cloudinary').v2;
const User = require("../models/User")


const createNewsArticle = async (req, res) => {
  try {
    const { headline, author, description, content, category, posterImage } = req.body; 
    const image_result = await cloudinary.uploader.upload(posterImage, {folder : "News"});
    const image_result_obj = {
      url : image_result.url
    }
    const newArticle = await NewsArticle.create({
      headline,
      author,
      description,
      content,
      category,
      thumbnail : image_result_obj
    });
    res.status(201).send({
      message : "News article posted successfully!",
      newArticle,
    });
  } catch (err) {
    res.status(500).send({ Error: err, success : false });
  }
};

const getNewsArticle = async (req, res) => {
  try {
    const articles = await NewsArticle.find().limit(15).sort({$natural:-1}).exec();
    if (articles) {
      res.status(200).send({
        total  : articles.length,
        articles
      });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
};

const getNewsArticleById = async (req, res) =>{
  const articleId  = req.query.articleId;
  try{
    const article = await NewsArticle.findOne({_id : articleId});
    if(!article){
      res.status(404).send({
        message : "Article not found. Please try again later."
      });
      return;
    }

    article.views += 1;

    await article.save();
    res.status(200).send({
      article
    });

  }catch(err){
    res.status(500).send({
      message : err.message
    });
  }
}

const getNewsArticlesByCategoryWithPage = async(req, res)=>{
  let {page, pageSize, category} = req.query;
  try{
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;
    const articles = await NewsArticle.find({ category: category}).skip((page-1)*pageSize).limit(pageSize).exec();
    if(articles.length <0){
      res.status(400).send({
        message : "No articles found of the category"
      });
    }
    res.status(200).send({
      totalArticles : articles.length,
      articles
    })
  }catch(err){
    res.status(500).send({ message: err.message });
  }
}

const getNewsByCategoryQuant = async(req, res)=>{
  let {category, quantity} = req.query;
  quantity = parseInt(quantity, 10);
  try{
    const articles = await NewsArticle.find({category}).sort({createdAt : -1}).limit(quantity).exec();
    res.status(200).send({
      articles : articles
    });
  }catch(err){  
    res.status(500).send({
      message  :"Some internal error occurred!",
      errror : err.message
    })
  }
}

const getAllNewsArticles = async(req, res)=>{
  let {page, pageSize} = req.query;
  try{
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 15;
    const articles = await NewsArticle.find().skip((page-1)*pageSize).limit(pageSize).exec();
    if(articles.length <0){
      res.status(400).send({
        message : "No articles found of the category"
      });
    }
    res.status(400).send({
      totalArticles : articles.length,
      articles
    })
  }catch(err){
    res.status(500).send({ message: err.message });
  }
}

const updateNewsArticle = async (req, res) => {
  try {
    const { headline, author, description, content, category, imageUrl } = req.body;
    const updatedArticle = await NewsArticle.findByIdAndUpdate(req.params.id, {
      headline,
      author,
      description,
      content,
      category,
      thumbnail
    }, { new: true });
    if (updatedArticle) {
      res.status(200).send(updatedArticle);
    } else {
      res.status(404).send({ message: 'Article not found' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

const deleteNewsArticle = async (req, res) => {
  try {
    const deletedArticle = await NewsArticle.findByIdAndDelete(req.params.id);
    if (deletedArticle) {
      res.status(200).send({ message: 'Article deleted successfully' });
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  getNewsArticle,
  getNewsArticleById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getNewsArticlesByCategory: getNewsArticlesByCategoryWithPage,
  getAllNewsArticles,
  getNewsByCategoryQuant
}