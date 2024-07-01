const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchAdmin = require('../middleware/adminInfo');


const shhh = "Internship Project";

// Route 1 : Creating a Admin

router.post('/createAdmin',[
    body('email','Enter valid email').isEmail(),
    body('username','Enter valid username').isLength({min : 3}),
    body('password','Enter valid password').isLength({min : 8})
] ,async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        let success = false;
        return res.json({success,error : result.array()});
    }

    try {
        let finding = await Admin.findOne({email : req.body.email});
        if(finding){
        let success = false;
            return res.json({success,error : "Email already exist"});
        }
        
        // opening account for new admin
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        let newAdmin = await Admin.create({
            email : req.body.email,
            username : req.body.username,
            password : secPass
        })

        const data = newAdmin.id

        const authToken = jwt.sign(data , shhh);
        let success = true;
        res.json({success,authToken});
    } catch (error) {
        res.status(400).json({ message: "Some Error Occured" });
    }
});



 // Route : 2 : Logging in the admin
 router.post('/login',[
    body('email','Enter valid email').isEmail(),
    body('password','Enter valid password').isLength({min : 8})],async (req,res)=>{

    const result = validationResult(req);
    if (!result.isEmpty()) {
    let success = false;
        return res.json({success,error : result.array()});
    }
    
    const {email , password} = req.body;

    try{

        // checking email
        let findingAdmin = await Admin.findOne({email : email});
        if(!findingAdmin){
    let success = false;
            return res.json({success,error : "Enter valid credentials to login"});
        }
        
        // checking password
        const check = await bcrypt.compare(password , findingAdmin.password);
        if(!check){
    let success = false;
            return res.json({success,error : "Enter valid credentials to login"});
        }

        const data = findingAdmin.id;

        const authToken = jwt.sign(data , shhh);
    let success = true;
        res.json({success,authtoken : authToken});
    } 
    catch (e){
        console.log(e);
        res.send("Some Error Occured");
    }
    });


    // Route 3 : Fetching admin details
    router.post('/fetchAdmin', fetchAdmin ,async (req,res)=>{
        try {
            let adminId = await req.admin;
            const adminInfo = await Admin.findById(adminId).select('-password');
            res.send(adminInfo);
            // res.send(adminInfo.email);
        } catch (e) {
            console.log(e);
            res.json({error : "Some Error Occured"});
        }
    });

module.exports = router;