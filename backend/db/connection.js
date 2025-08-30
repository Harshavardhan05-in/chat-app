const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/USERS-DATA")
.then(()=>{
    console.log("Connection Sucessfull");
})
.catch(()=>{
    console.log(" Not Connected")
})