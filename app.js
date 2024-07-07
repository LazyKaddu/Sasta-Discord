const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const http = require('http');
const socketIo = require("socket.io");
// const db = require("./config/mongoose-connection");
const userRouter = require('./routers/User-Routers/usersRouter');
const ApiRouters = require('./routers/ApiRouters');
const passport = require('passport');
const session = require('express-session');
const initializeSocket = require("./utils/socket-setup");
const PORT = process.env.PORT || 8005

const app = express();

//socket server
const server = http.createServer(app);
const io = socketIo(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    }
})


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
app.use(cors())


// Authenticaions
app.use('/user/action', userRouter);

// api end points
app.use('/api', ApiRouters);

app.get('/',(req,res)=>{
    res.send("hey");
})

// socket initialize
initializeSocket(io);

// listen
app.listen(PORT, ()=>{
    console.log(`app is running in ${PORT}`);
});