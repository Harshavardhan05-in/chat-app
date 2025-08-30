
const mongoose = require('mongoose');
const UserDetails = require('./LogInSchema');

const ChartSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    groupchat:{
        type:Boolean,
        default:false
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:"LoginDetails",
        required:true
    },
    members:[{
        type:mongoose.Types.ObjectId,
        ref:"LoginDetails"

    }]
})

const Charts = new mongoose.model("ChartsData",ChartSchema);

module.exports = Charts;