const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomsSchema = new Schema({
    room : {
        type : String,
        required : true,
        unique : true
    }, 
    type : {
        type : String,
        required : true
    },
    vip : {
        type : Boolean,
        required : true
    },
    available : {
        type : Boolean,
        required : true
    }
  });

  const rooms = mongoose.model('Rooms',roomsSchema);
  rooms.createIndexes();
  module.exports = rooms;