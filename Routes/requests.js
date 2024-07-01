const express = require('express');
const router = express.Router();
const Requests = require('../models/Requests.js');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/userInfo');
const fetchAdmin = require('../middleware/adminInfo');


// Route 1 : Adding a Request

let cd = new Date();

router.post('/addRequest',[
    body('email','Enter valid email').isEmail(),
    body('name','Enter valid name').isString(),
    body('department','Enter valid department').isString(),
    body('company','Enter valid company').isString(),
    body('checkin','Enter valid date').isDate(),
    body('checkout','Enter valid date').isDate()
    // body('room','Enter valid room'),
    // body('roomtype','Enter valid roomtype')
], fetchUser ,async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        let success = false;
        return res.json({success,error : result.array(), message : "Enter the form correctly!!"});
    }

    try {
        let finding = await Requests.find({room : req.body.room});
        if((finding[0]!== undefined) && finding[0].status === "Pending"){
        let success = false;
            return res.json({success,message : "Already Requested"});
        }
            else if(new Date(req.body.checkin)>cd && new Date(req.body.checkout)>cd){
            let newRequest = await Requests.create({
                email : req.body.email,
                name : req.body.name,
                department : req.body.department,
                company : req.body.company,
                checkin : req.body.checkin,
                checkout : req.body.checkout,
                // room : req.body.room,
                user : req.user,
                // roomtype : req.body.roomtype,
            })
            
            
            let success = true;
            res.json({success,newRequest,message : "Request has been sent!!"});
        }

        else{
            let success = false;
            return res.json({success,message : "Enter the date correctly"});
        }

        
    } catch (error) {
        res.status(400).json({ message: "Some Error Occured", error : error.message });
    }
});



// Route 2 : Fetching the requests of the user
router.get('/user/fetchRequest', fetchUser , async(req,res)=>{
    try {
        const request = await Requests.find({user : req.user});
        res.json(request);
    } catch (error) {
        res.json({error : "Some error occured"});
    }
})


// Route 3 : Fetching the requests for the admin
router.get('/admin/fetchRequest', fetchAdmin , async(req,res)=>{
    try {
        const request = await Requests.find({"status" : "Pending"});
        res.json(request);
    } catch (error) {
        res.json({error : "Some error occured"});
    }
})


// Route 4 : Approving requests by the admin
router.post('/admin/approveRequest/:id', fetchAdmin , async(req,res)=>{
    try {
        const updateRequest = {};
        updateRequest.status = "Approved";
        const request = await Requests.findByIdAndUpdate(req.params.id, {$set : updateRequest}, {new : true});
        res.json({success : true, request});
    } catch (error) {
        res.json({error : "Some error occured"});
    }
})


// Route 5 : Rejecting requests by the admin
router.post('/admin/rejectRequest/:id', fetchAdmin , async(req,res)=>{
    try {
        const updateRequest = {};
        updateRequest.status = "Rejected";
        const request = await Requests.findByIdAndUpdate(req.params.id, {$set : updateRequest}, {new : true});
        res.json({success : true, request});
    } catch (error) {
        res.json({error : "Some error occured"});
    }
})


    // Route 4 : To remove the request from database

    router.delete('/removeRequest/:id', fetchUser, async(req,res)=>{
        try {
        let request = await Requests.findById(req.params.id);  
        if(!request){
            // res.json({error : "Request not found"});
        }
        else if(request.user.toString()!== req.user){
            res.send("Access Denied");
        }
            await Requests.findByIdAndDelete(req.params.id);
            res.json({message : "Request deleted successfully"});   
    }
    catch (error) {
        res.json({message : "Some Error Occured", error : error.message});
    };
})

module.exports = router;