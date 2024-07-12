const express = require('express');
const router = express.Router();
const passport = require('passport');
const upload = require('../../utils/multer-setup');
const userModel = require('../../models/user-model');
const authController = require('../../controllers/authController');
const isLoggedIn = require('../../middlewares/is-Logged-In');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', isLoggedIn, authController.logout);


router.get('/get-user', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user) 
      return res.json({message: 'User Found', user});
    res.json({message: 'No User Found'});
  } catch {
    res.json({message: 'Error Logging In'});
  }
});



module.exports = router;
