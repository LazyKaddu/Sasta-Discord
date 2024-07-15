const express = require("express");
const router = express.Router();
const nodeMailer = require('nodemailer');




router.post('/contact', async(req,res)=>{
    const { name, email, message } = req.body;

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'mehengadiscord@gmail.com',
            pass: process.env.PASSWORD,
        }
    });
    
    const mailoption = {
        from:'mehengadiscord@gmail.com',
        to: 'aashishnegi0000@gmail.com, nikhil220705@gmail.com',
        subject: 'bhai kaam kr raha hai kya yeh',
        text: `name - ${name} email - ${email} says - ${message} at - ${Date.now}`
    };

    transporter.sendMail(mailoption, (error,info)=>{
        if(error){
            res.json({ error : 'mail not send'});
        }
        else if (info){
            res.json({ success : info });
        }
    })

})