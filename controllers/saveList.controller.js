const NewsArticle = require('../models/News');
const User = require("../models/User");


const addToSaveList = async (req, res)=>{
    const userId = req.query.userId;
    const articleId = req.query.articleId;
    try{
      const user = await User.findOne({_id : userId});
      const article = await NewsArticle.findOne({_id : articleId});
      let isAlreadyExist = false;
      let exist = user.saveList.filter((item)=>item.articleId == articleId);
      if(exist.length != 0){
        isAlreadyExist = true;
      }

      if(isAlreadyExist){
        res.status(200).send({
          message : "Article already exists in your saved articles."
        });
        return;
      }

      user.saveList.push({
        articleId : article._id,
        headline : article.headline,
        description : article.description,
        imageUrl : article.thumbnail.url,
      })
      await user.save();
      res.status(200).send({
        message : 'Article saved successfully.',
        articlesSaved : user.saveList
      })
    }catch(err){
      res.status(500).send({
        message : err.message
      })
    }
}

const removeFromSaveList = async (req, res)=>{
    const saveId = req.query.saveId;
    const userId = req.query.userId;
    try{
        const user = await User.findOne({_id : userId});
        let saveIndex;
        saveIndex = user.saveList.findIndex(save => save._id == saveId);
        if(saveIndex == -1){
            res.status(200).send({
                message : "Article not found in your list."
            });
            return;
        }
        user.saveList.splice(saveIndex, 1);
        await user.save();
        res.status(200).send({
            message : "Article removed from your favourites.",
            saveList : user.saveList
        });
    }catch(err){
        res.status(500).send({
            message : "Some internal error occurred!"
        })
    }

}

module.exports = {
    addToSaveList,
    removeFromSaveList
}