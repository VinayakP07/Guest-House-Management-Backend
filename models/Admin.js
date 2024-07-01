const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    email : {
        type : String,
        toBeRequired : true,
        unique : true
    }, 
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now  
    },
    admin : {
        type : Boolean,
        default : true
    }
  });

  const admin = mongoose.model('Admin',adminSchema);
  admin.createIndexes();
  module.exports = admin;