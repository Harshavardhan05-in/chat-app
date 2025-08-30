
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Types.ObjectId,
        ref:"LoginDetails",
        required:true
    },
    receiver:{
        type:mongoose.Types.ObjectId,
        ref:"LoginDetails",
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:["accepted","rejected","pending"]

    }

})

const Requests = new mongoose.model("RequestUsers",RequestSchema);

module.exports = Requests;