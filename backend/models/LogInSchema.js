
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:1
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileimage:{
        type:String,
        default:"",
        required:false
    },
    tokens:[{
        token:{
            type:String
        }
    }],
    loginDate:{
        type:Date,
        required:false,
        default:null
    },
    isonline:{
        type:Boolean,
        required:false,
        default:null
    },
    lastseen:{
        type:Date,
        required:false,
        default:null
    }
})

UserSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.JWT_SIGN);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

const UserDetails = new mongoose.model("LoginDetails",UserSchema);

module.exports = UserDetails;