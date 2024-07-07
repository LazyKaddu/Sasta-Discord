const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('../../utils/multer-setup');
const userModel = require('../../models/user-model');
const authController = require('../../controllers/authController');
passport.use(new localStrategy(userModel.authenticate()));


router.post('/register', async function(req, res){
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.json({error : 'Arguments missing'});
    }

    const ifUser = await userModel.findOne({username : username});
    if (ifUser) {
      return res.json({error : 'A user with the given username is already registered'});
    }
  
    const userData = new userModel({ username, email })
    userModel.register(userData, password).then(function() {
        passport.authenticate('local')(req, res, function(){
          res.json({success : 'User created', user_id: userData._id, username });
        })
      })
  } catch (error) {
    res.json({error : 'Error Occured! Try again'});
  }
})

router.post('/login', authController.login);

router.post('/logout', authController.logout);


router.get('/get-user', async (req, res) => {
  try {
    const user = await userModel.findById(req.session.passport.user);
    if (user) 
      return res.status(200).json({message: 'User Found', user});
    res.status(400).json({message: 'No User Found'});
  } catch {
    res.status(500).json({message: 'Error Logging In'});
  }
});



module.exports = router;
