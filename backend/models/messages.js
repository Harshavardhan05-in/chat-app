
const mongoose = require('mongoose');
const UserDetails = require('./LogInSchema');
const Charts = require('./chat');

const MessageSchema = new mongoose.Schema({
    content:{
        type:String,
    },
    sender:{
        type:mongoose.Types.ObjectId,
        ref:"LoginDetails",
        required:true
    },
    receiver:{
        type:mongoose.Types.ObjectId,
        ref:"LoginDetails"
    },
    chartlinked:{
        type:mongoose.Types.ObjectId,   
        ref:"ChartsData" ,
        required:true
    },
    attachments:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    date:{
        type:String,
        required:false
    }
    
})

const Messages = new mongoose.model("Messageslist",MessageSchema);

module.exports = Messages;