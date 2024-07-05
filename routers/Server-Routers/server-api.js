const express = require("express");
const router = express.Router();
const userModel = require("../../models/user-model");

router.get('/', (req, res) => {
    res.send('server');
})

module.exports = router;
