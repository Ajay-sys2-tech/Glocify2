const jwt = require('jsonwebtoken');
const Register = require('../models/user')


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);


        // const user = await Register.findOne({_id: verifyUser._id});

        next();
    } catch (error) {
        return res.status(404).send(error + "You cannot access this page, Invalid login request")
    }
};


module.exports = auth;