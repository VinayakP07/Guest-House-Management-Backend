const { application } = require('express');
const jwt = require('jsonwebtoken');

const shhh = "Internship Project";

const fetchAdmin = (req, res, next) =>{
    const token = req.header('auth_token');
    if(!token){
        res.json({error : "Enter valid token"});
    }
    try {
        let data = jwt.verify(token, shhh);
        req.admin = data;
        next();
    } catch (e) {
        console.log(e);
        res.json({error : "Enter valid token"});
    }
}

module.exports = fetchAdmin;

