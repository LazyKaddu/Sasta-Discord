const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const serverRouter = require('./Server-Routers/server-api');
const channelRouter = require('./Channel-Routers/channel-api');
const messageRouter = require('./Message-Routers/message-api');
const userRouter = require('./User-Routers/usersRouter');


router.use('/server', serverRouter);
router.use('/channel', channelRouter);
router.use('/message', messageRouter);
router.use('/user', userRouter);


module.exports = router;
