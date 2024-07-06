const express = require("express");
const router = express.Router();
const userModel = require("../../models/user-model");

router.get('/', (req, res) => {
    res.send('message');
})

module.exports = router;
