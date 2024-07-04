const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/discord")
    .then(()=>{
        console.log("database connected")
    })
    .catch(
        console.log((err)=>{
            console.log(err);
        })
    )

module.exports = mongoose.connection;