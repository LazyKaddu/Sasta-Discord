const passport = require("passport");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const {generateToken} = require('../utils/generate-token');

exports.register = async (req, res) => {
  // try {
  //   const { username, email, password } = req.body

  //   if (!username || !email || !password) {
  //     return res.json({error : 'Arguments missing'});
  //   }

  //   const ifUser = await userModel.findOne({username : username});
  //   if (ifUser) {
  //     return res.json({error : 'A user with the given username is already registered'});
  //   }

  //   const userData = new userModel({ username, email })
  //   userModel.register(userData, password).then(function() {
  //       passport.authenticate('local')(req, res, function(){
  //         res.json({success : 'User created', user_id: userData._id, username });
  //       })
  //     })
  // } catch (error) {
  //   res.json({error : 'Error Occured! Try again'});
  // }
  try {
    const { username, email, password } = req.body;

    if (await userModel.findOne({ username: username })) {
      return res.json({ error: "Username already exists" });
    }

    bcrypt.genSalt((err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.json({ error: err.message });

        const user = await userModel.create({
          username,
          email,
          password: hash,
        });

        const token = generateToken(user);
        res.cookie("token", token);
        res.json({ success: "Account Registered!", user });
      });
    });
  } catch (err) {
    return res.json({ error: err.message });
  }
};

exports.login = async (req, res, next) => {
  // passport.authenticate('local', (err, user, info) => {
  //   if (err) return next(err);
  //   if (!user) return res.json({ message: 'Username or Password is Incorrect' });

  //   req.logIn(user, (err) => {
  //     if (err) return next(err);
  //     return res.json({ message: 'Logged in successfully', user });
  //   });
  // })(req, res, next);
  try {
    let { username, password } = req.body;

    let user = await userModel.findOne({ username: username });
    if (!user) {
      return res.json({ error: "No User found!" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.json({ message: "Error occured! try Again." });

      if (result) {
        const token = generateToken(user);
        res.cookie("token", token, {sameSite: 'Strict', maxAge:86400000, httpOnly:true});
        console.log('cookie token after login', token)
        return res.status(200).json({ message: "Logged in successfully", user });
      } else {
        res.json({ message: "Username or Password is Incorrect" });
      }
    });
  } catch {
    return res.json({ message: "Error occured! try Again." });
  }
};

exports.logout = (req, res) => {
  // req.logout((err) => {
  //   if (err) return res.json({ error: "Error logging out" });
  //   res.json({ success: "Logged out successfully" });
  // });
  res.cookie('token', '');
  res.json({message : 'Logged out successfully'});
};
