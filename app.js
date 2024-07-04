const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");

const ownersRouter = require("./routers/ownersRouters.js")
const usersRouter = require("./routers/usersRouter.js")

// const db = require("./config/mongoose-connection.js")

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/owners", ownersRouter)
app.use("/users", usersRouter)


app.get("/",(req,res) => {
    res.send("hey");
});

app.listen(3000,()=>{
    console.log('app is running in 3000');
});

console.log('hello');