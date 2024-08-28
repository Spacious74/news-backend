const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next)=>{
    const token = req.cookies.authToken;
    if(!token){
        return res.status(401).send({
            message : "Access denied. No token provided."
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);
        // req.user = decoded;
        next();
    }catch(err){
        res.status(403).send({
            message : "Unauthorized! Invalid token."
        });
    }
}

module.exports = verifyToken;