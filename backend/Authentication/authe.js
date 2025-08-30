
const jwt = require('jsonwebtoken');
const UserDetails = require('../models/LogInSchema');


const authe = async(req,res,next) => {
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token,"Harshavardhanushakolafrombhushanraopet");
        const user = await UserDetails.findOne({_id:verify._id});
        req.userdata = user;
        next();
    } catch (error) {
        console.log(error);
    }
}

const adminAuth = async(req,res,next)=>{
    try {
        const token = req.cookies.admin;
        console.log("NEW TOEN:",token);
        const verify = jwt.verify(token,"HarshaVardhanRguktBasar96325481");
        if(verify.role!=="admin"){
            throw new Error("Unauthorized");
        }
        next();
    } catch (error) {
        console.log(error); 
    }
}

module.exports = {authe,adminAuth};