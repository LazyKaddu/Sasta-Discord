const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('../utils/multer-setup');
const userModel = require('../models/user-model');
passport.use(new localStrategy(userModel.authenticate()));


router.post('/register', function(req, res){
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.json({error : 'Arguments missing'});
  }
  
  try {
    const userData = new userModel({ username, email })
    userModel.register(userData, password).then(function() {
        passport.authenticate('local')(req, res, function(){
          res.json({success : 'User created'});
        })
      })
  } catch (error) {
    res.json({error : 'Error Occured'});
  }
})


router.post('/login', passport.authenticate('local'), function(req, res) {
  if (req.user) {
    return res.status(200).json({success : 'User Logged In'});
  }
  res.status(500).json({error : 'Logged Failed'});;
});


module.exports = router; 