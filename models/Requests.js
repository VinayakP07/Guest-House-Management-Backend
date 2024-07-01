const mongoose = require('mongoose');
const { Schema } = mongoose;

const requestsSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : true
    },
    // room : {
    //     type : Number,
    //     required : true
    // },
    // roomtype : {
    //     type : String,
    //     required : true
    // },
    status : {
        type : String,
        required : true,
        default : "Pending"
    },
    email : {
        type : String,
        required : true
    }, 
    name : {
        type : String,
        required : true
    },
    department : {
        type : String,
        required : true
    },
    company : {
        type : String,
        required : true
    },
    checkin : {
        type : Date,
        required : true
    },
    checkout : {
        type : Date,
        required : true
    },
    date : {
        type : Date,
        default : Date.now  
    }
  });

  const requests = mongoose.model('Requests',requestsSchema);
  requests.createIndexes();
  module.exports = requests;