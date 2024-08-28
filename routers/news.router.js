const express = require('express');
const router = express.Router();
const controller = require('../controllers/news.controller')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage,
    limits: {
        fieldSize: 10 * 1024 * 1024, 
    },
});

// Create route
router.post('/add', upload.single('posterImage'), controller.createNewsArticle);
// Read route
router.get('/all', controller.getNewsArticle);
router.get('/load', controller.getNewsArticlesByCategory);
router.get('/category', controller.getNewsByCategoryQuant)
router.get('/allArticles', controller.getAllNewsArticles);
router.get('/getArticle', controller.getNewsArticleById);
// Update route
router.put('/:id', controller.updateNewsArticle);
// Delete route
router.delete('/:id', controller.deleteNewsArticle);


module.exports = router;