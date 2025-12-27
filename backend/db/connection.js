const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connection Sucessfull!");
})
.catch(()=>{
    console.log(" Not Connected")
})