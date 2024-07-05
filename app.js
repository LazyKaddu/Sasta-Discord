const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose-connection");
const session = require('express-session');
const passport = require('passport');
const PORT = process.env.PORT || 8005

// importing API routers
const userRouter = require('./routers/User-Routers/usersRouter');
const ApiRouters = require('./routers/ApiRouters');


const app = express();

// session
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'Some random shit'
}));


// passport configuration 
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser( (user, done) => {
    done(null, user.id);
});
passport.deserializeUser( (user, done) =>  {
    done(null, {
        provider: user.provider,
        id: user.provider_id
    });
});


// middlewares
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Authenticaions
app.use('/user/action', userRouter);

// api end points
app.use('/api', ApiRouters);


// listen
app.listen(PORT, ()=>{
    console.log(`app is running in ${PORT}`);
});