const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
require('dotenv').config();
const cors = require("cors");
const http = require('http');
const socketIo = require("socket.io");
const db = require("./config/mongoose-connection");
const userRouter = require('./routers/User-Routers/usersRouter');
const ApiRouters = require('./routers/ApiRouters');
const passport = require('passport');
const localStrategy = require('passport-local');
const userModel = require('./models/user-model');
const session = require('express-session');
const initializeSocket = require("./utils/socket-setup");
const PORT = process.env.PORT || 4000

const app = express();
const server = http.createServer(app);
app.server = server;

app.use(cookieParser());

//socket server 
const io = socketIo(server,{
    cors:{
        origin: "http://localhost:5173",
        credentials: true,
        methords: ["GET","POST"]
    }
})

//session
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: 'Some random shit'
});
app.use(sessionMiddleware);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});


// passport configuration 
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(userModel.authenticate()));
// passport.serializeUser( (user, done) => {
//     done(null, user.id);
// });
// passport.deserializeUser( (user, done) =>  {
//     done(null, {
//         provider: user.provider,
//         id: user.provider_id
//     });
// });


// middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


// Authenticaions
app.use('/user/action', userRouter);

// api end points
app.use('/api', ApiRouters);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"dist/index.html"));
})

// socket initialize
initializeSocket(io);

// listen
server.listen(PORT, ()=>{
    console.log(`app is running in ${PORT}`);
});