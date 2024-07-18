const express = require("express");
const router = express.Router();
const serverRouter = require('./Server-Routers/server-api');
const messageRouter = require('./Message-Routers/message-api');
const userRouter = require('./User-Routers/usersRouter');
const contactRouter = require('./Contact-Routers/contact-api');


router.use('/user', userRouter);
router.use('/server', serverRouter);
router.use('/message', messageRouter);
router.use('/contacted',contactRouter);


module.exports = router;
