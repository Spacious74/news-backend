const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Check if username or email already exists 
    const existingUser = await User.findOne({email : req.body.email});
    if (existingUser) {
      return res.status(400).send({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePicture :{
        public_id: "",
        url: ""
      }
    });

    const token = jwt.sign({userId : newUser._id},process.env.JWT_TOKEN_SECRET_KEY,{expiresIn : '1h'} )

    res.cookie('authToken', token, { 
      expires: new Date(Date.now() + (1 * 60 * 60 * 1000)),
    });

    // Return success message
    res.status(200).send({ 
      message: 'User registered successfully', 
      userId : newUser._id, 
      name : newUser.username, 
      email : newUser.email,
      token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    // Find the user by username or email
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN_SECRET_KEY, {expiresIn : '1h'});
    res.cookie('authToken', token, { 
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    });

    res.status(200).send({ 
      message : "User logined successfully!",
      userId : user._id,
      name : user.username, 
      email : user.email,
      token 
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const googleLoginSignup = async (req, res)=>{

  try{
    const user = await User.findOne({email: req.body.email});
    if (user) {

      const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN_SECRET_KEY, {expiresIn : '1h'});

      res.cookie('authToken', token, { 
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        secure : false
      });
  
      res.status(200).send({ 
        message : "User loggedIn successfully!",
        userId : user._id,
        name : user.username, 
        email : user.email,
        profilePicture : user.profilePicture.url,
        token 
      });
    }else{

      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        profilePicture :{
          public_id: "",
          url: req.body.url
        }
      });

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_TOKEN_SECRET_KEY, {expiresIn : '1h'});

      res.cookie('authToken', token, { 
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      });
  
      res.status(200).send({ 
        message : "User registered successfully!",
        userId : newUser._id,
        name : newUser.username, 
        email : newUser.email,
        profilePicture : newUser.profilePicture.url,
        token 
      });
      
    }
  }catch(err){
    res.status(500).send({ message: err.message });
  }
  
}

// GETTING USER'S DATA AFTER TOKEN VERIFICATION
const getUserData = async (req, res) => {
  const userId = req.params.userId;
  try{
    const user = await User.findOne({_id : userId});
    if(!user){
      res.status(404).send({
        message : "User not found! Something went wrong."
      })
    }
    res.status(200).send(user)
  }catch(err){
    res.status(500).send({
      message : err.message
    })
  }
}


module.exports = { registerUser, loginUser, getUserData, googleLoginSignup };
