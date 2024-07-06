const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
// const db = require("./config/mongoose-connection");
const userRouter = require('./routers/User-Routers/userRouter');
const ApiRouters = require('./routers/ApiRouters');
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT || 8005

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

app.get('/',(req,res)=>{
    res.send("hey");
})

// listen
app.listen(PORT, ()=>{
    console.log(`app is running in ${PORT}`);
});