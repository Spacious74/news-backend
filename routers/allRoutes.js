const express = require("express");
const allRoutes = express.Router();

const userRouter = require('./user.route');
const newsRouter = require('./news.router');
const saveRouter = require('./save.router');


const base_url = '/kanpurToday/api/v1/'

allRoutes.use(base_url+'user', userRouter);
allRoutes.use(base_url+'news', newsRouter);
allRoutes.use(base_url+'save', saveRouter);

allRoutes.use(base_url, (req,res)=>{
    res.status(200).send({
        message : "Api working successfully!"
    })
});

module.exports = allRoutes;