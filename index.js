const {app, dbconnection} = require("./connection");
const PORT = process.env.PORT || 8080;
const cloudinary = require('cloudinary').v2;
const cookieParser = require('cookie-parser');
const cors = require("cors");

// CONNECTING TO DATABASE
dbconnection();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET_KEY 
});

app.use(cookieParser());
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true
}));

// IMPORTING ALL ROUTES
const allRoutes = require("./routers/allRoutes")
app.use(allRoutes);


// RUNNING SERVER ON PORT
app.listen(PORT, ()=>{
    console.log("Server is listening on port : " + PORT);
});

