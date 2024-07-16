const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.json({error : 'you need to login first'});
    }
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
        let user = await userModel
            .findOne({ email : decoded.email })
            .select('-password');
        
        req.user = user;
        next();

    } catch (err) {
        return res.json({error : 'something went wrong!'});
    }
}
