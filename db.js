const mongoose = require('mongoose');
const mongURL = "mongodb+srv://Vinayak:Vinayak%4007@vinayak.chmsbpd.mongodb.net/Guest_House_Management";

const connectToMongo = async() => {
    await mongoose.connect(mongURL);
    console.log("Connected to your MongoDB Database Successfully");
}

module.exports = connectToMongo;