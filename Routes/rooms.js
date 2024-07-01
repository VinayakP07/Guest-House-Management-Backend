const express = require('express');
const router = express.Router();
const Rooms = require('../models/Rooms.js');
// const Requests = require('../models/Requests.js');
const { body, validationResult } = require('express-validator');
// const fetchUser = require('../middleware/userInfo');
// const fetchAdmin = require('../middleware/adminInfo');


// Route 1 : Adding a Room

router.post('/addRoom',[
    body('room','Enter valid room').isString(),
    body('type','Enter valid room type').isString(),
    body('vip','Enter valid data').isBoolean(),
    body('available','Enter valid data').isBoolean()
],async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        let success = false;
        return res.json({success,error : result.array()});
    }

    try {
        let finding = await Rooms.find({room : req.body.room});
        if(finding[0]!== undefined){
        let success = false;
            return res.json({success,message : "Room Already Exists"});
        }

            
            let newRoom = await Rooms.create({
                room : req.body.room,
                type : req.body.type,
                vip : req.body.vip,
                available : req.body.available,
            })
            
            
            let success = true;
            res.json({success,newRoom});
        
    } 
    catch (error) {
        res.status(400).json({ message: "Some Error Occured", error : error.message });
    }
});


    // Route 2 : To remove the room from database

    router.delete('/removeRoom/:id', async(req,res)=>{
        try {
        let room = await Rooms.findById(req.params.id);  
        if(!room){
            // res.json({error : "Request not found"});
        }
            await Rooms.findByIdAndDelete(req.params.id);
            res.json({message : "Room deleted successfully"});   
    }
    catch (error) {
        res.json({message : "Some Error Occured", error : error.message});
    };
})


// Route 3 : Fetching the rooms to the user
router.get('/user/fetchRooms', async(req,res)=>{
    try {
        const room = await Rooms.find({available : true});
        res.json(room);
    } catch (error) {
        res.json({error : "Some error occured"});
    }
})


// Route 4 : Fetching the rooms to the admin
router.get('/admin/fetchRooms', async(req,res)=>{
    try {
        const room = await Rooms.find();
        res.json(room);
    } catch (error) {
        res.json({error : "Some error occured"});
    }
})



// Route 5 : Making room available by the admin
router.put('/roomAvailable/:id', async (req,res)=>{
    try {
        // finding the room that is to be udated
        let room = await Rooms.findById(req.params.id);
        if(!room){
            res.json({error : "Room not found"});
        }
        updateRoom = {};
        updateRoom.available = true;
        // Updating the room
        room = await Rooms.findByIdAndUpdate(req.params.id, {$set : updateRoom}, {new : true})
        res.json(room);
        
    } 
    catch (error) {
        res.json({error : "Some Error Occured"});
    }

});



// Route 6 : Making room unavailable by the admin
router.put('/roomUnavailable/:id', async (req,res)=>{
    try {
        // finding the room that is to be udated
        let room = await Rooms.findById(req.params.id);
        if(!room){
            res.json({error : "Room not found"});
        }
        updateRoom = {};
        updateRoom.available = false;
        // Updating the room
        room = await Rooms.findByIdAndUpdate(req.params.id, {$set : updateRoom}, {new : true})
        res.json(room);
        
    } 
    catch (error) {
        res.json({error : "Some Error Occured"});
    }

});

module.exports = router;
