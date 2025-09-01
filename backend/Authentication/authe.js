
const jwt = require('jsonwebtoken');
const UserDetails = require('../models/LogInSchema');


const authe = async(req,res,next) => {
    console.log("INSIDE AUTHENTICATE FUN");
    try {
        const token = req.cookies.jwt;
        console.log("TOKEN :",token);
        const verify = jwt.verify(token,process.env.JWT_SIGN);
        const user = await UserDetails.findOne({_id:verify._id});
        req.userdata = user;
        next();
    } catch (error) {
        console.log("AUTH ERROR:",error);
    }
}

const adminAuth = async(req,res,next)=>{
    try {
        const token = req.cookies.admin;
        console.log("NEW TOEN:",token);
        const verify = jwt.verify(token,process.env.ADMIN_SIGN);
        if(verify.role!=="admin"){
            throw new Error("Unauthorized");
        }
        next();
    } catch (error) {
        console.log(error); 
    }
}

module.exports = {authe,adminAuth};