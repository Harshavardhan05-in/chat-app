require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const corsOption = {
    origin:["https://chat-app-3-hfer.onrender.com"],
    methods:["POST","PUT","PATCH","DELETE","GET"],
    credentials:true
}
app.use(cors(corsOption));
app.set("trust proxy", 1);


const UserDetails = require('./models/LogInSchema');
require('./db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser')
const {authe,adminAuth} = require('./Authentication/authe');
const Charts = require("./models/chat");
const Requests = require('./models/request');
const Messages = require('./models/messages');

app.use(express.json());
app.use(cookieParser());


const {Server} = require("socket.io");
const http = require('http');
const server = http.createServer(app);

const port = process.env.PORT || 5000 ;



const io = new Server(server,{
    cors:{
        origin:"https://chat-app-3-hfer.onrender.com",
        methods:["GET","POST"],
        credentials:true,
    }

});

// ✅ Global Middleware to measure request time
app.use((req, res, next) => {
  const start = Date.now(); // capture start time

  // when the response finishes, calculate time
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[API TIME] ${req.method} ${req.originalUrl} took ${duration} ms`);
  });

  next(); // move to next middleware/route
});



io.on("connection",(socket)=>{
    // console.log(" New User Connected To the Socket:",socket.id);

    const userId = socket.handshake.query.userId;
    if(userId){
       UserDetails.findByIdAndUpdate(userId,{isonline:true}).catch(err=>console.log("ONLINE ERROR:",err));

    }

    //Mark user as online

    socket.on("join_chat",(chatId)=>{
        socket.join(chatId);
        console.log("User joined Room ",chatId);
    });

    socket.on("leaveRoom",(chatId)=>{
        socket.leave(chatId);
        // console.log("User",socket.id," left room :",chatId)
    })

    socket.on("send_message",(curr)=>{
        console.log("INCMG MSSG :",curr);
        const chatId = curr.chartlinked._id;
        console.log("SENDER LINKED CHAT:",chatId);
        io.to(chatId).emit("receive_message",curr);


    })

    socket.on("disconnect",()=>{
        if(userId){
            UserDetails.findByIdAndUpdate(userId,{
                isonline:false,lastseen:new Date()
            }).catch(err=>console.log("TIME UPDATION ERR:",err));
        }
        // console.log("client disconnected",socket.id)
    })
})



app.post("/postregister",async(req,res)=>{
    try {
        const data = req.body;
        if(data.password!==data.cpassword){
            res.status(401).send("Invalid");
        
        }else{
            const hashedPass = await bcrypt.hash(data.password,10);
            data.cpassword = undefined;
            data.password=hashedPass;
            data.loginDate = new Date();
            const newuser = new UserDetails(data);
            const result = await newuser.save();
            res.status(201).send(result);
        }
    } catch (error) {
        console.log("Error In Post:",error);
        res.status(500).send(error);
    }
})

app.post("/postlogin",async(req,res)=>{
    try {
        const data = req.body;
        const user = await UserDetails.findOne({email:data.email});
        if(!user){
            res.status(404).send("User Not Found");
            return ;
        }else{
            const isMatched = await bcrypt.compare(data.password,user.password);
            const token = await user.generateAuthToken();
            console.log("TOKEN INSIDE INDEX.JS:",token);
            if(isMatched){
                res.cookie("jwt",token,{
                    // httpOnly: true,   // prevents client-side JS from accessing it
                    secure: true,     // required if you're using https (Render uses https)
                    sameSite: "None",
                    expires:new Date(Date.now()+5000000),
                })
                res.status(200).send(user);
            }else{
                res.status(404).send("Invalid Credentials");
            }
        }
    } catch (error) {
        console.log(error);    
    } 
})

app.get("/getlogin",authe,(req,res)=>{
    try {
        console.log("INSIDE GET LOGIN BACKEND FUNC");
        const data = req.userdata;
        res.status(200).send(data);
    } catch (error) {
        console.log("BACKEND ERROR :",error);
        res.status(500).send(error);
    }
})

app.get("/logout",(req,res)=>{
    try {
        res.clearCookie('jwt');
        res.status(200).send("Sucessfully Deleted");
    } catch (error) {
        res.status(500).send(error);
        
    }
})

app.delete("/delete/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await UserDetails.findByIdAndDelete({_id:id});
        res.status(201).send(result);
    } catch (error) {
        console.log("ERROR",error);
        res.status(500).send(error);
    }
})

app.get("/getall",async(req,res)=>{
    try {
        const result = await UserDetails.find();
        res.status(200).send(result);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.post("/addgroup",async(req,res)=>{
    try {   
        const data = req.body;
        const ch = new Charts(data);
        const result = await ch.save();
        res.status(201).send(result);
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
    
})

app.post("/addreq",async(req,res)=>{
    try {
        const data = req.body;
        const newR = new Requests(data);
        const result = await newR.save();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
    
})

app.get("/mycharts/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Charts.find({members:id}).populate("members");
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/modifychats/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Charts.find({$and:[{creator:id},{members:id},{groupchat:true}]}).populate("members","username");
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.put("/update/:id",async(req,res)=>{
    try {
        const groupId = req.params.id;
        const data = req.body;
        const result = await Charts.findByIdAndUpdate({_id:groupId},{$set:{members:data}});
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.delete("/deletegroup/:id",async(req,res)=>{
    try {
        const chatId = req.params.id;
        const result = await Charts.findByIdAndDelete({_id:chatId});
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

})

app.put("/exit/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await Charts.findByIdAndUpdate({_id:id},data);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

})

app.get("/recreq/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Requests.find({receiver:id}).populate("sender receiver","username");
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.put("/updatereq/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await Requests.findByIdAndUpdate({_id:id},data).populate("sender receiver","username");
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.post("/addpersonalchat",async(req,res)=>{
    try {
        const data = req.body;
        const newPernoalchat = new Charts(data);
        const result = await newPernoalchat.save();
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/getchat/:id",async(req,res)=>{
    try {
        const chatId = req.params.id;
        const result = await Charts.findOne(chatId).populate("members creator")
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.post("/addmsg",async(req,res)=>{
    try {
        const newMsg = new Messages(req.body);
        const result = await newMsg.save();

        const newRes = await Messages.find({_id:result._id}).populate("sender chartlinked");

        res.status(201).send(newRes[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/myfrndcnt/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Requests.find({$and:[{status:"accepted"},{$or:[{sender:id},{receiver:id}]}]}).countDocuments();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/chatcount/:id",async(req,res)=>{
    try {
        const userId = req.params.id;
        const result = await Charts.find({$and:[{members:userId},{groupchat:true}]}).countDocuments();
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/allchats",async(req,res)=>{
    try {
        const result = await Charts.find({groupchat:true}).populate("members","profileimage");
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/chatmsg/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Messages.find({chartlinked:id}).countDocuments();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/mymsg",async(req,res)=>{
    try {
        const result = await Messages.find();
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
    }
})

app.get("/getchat/:id",async(req,res)=>{
    try {
        const chatId = req.params.id;
        const result = await Charts.find({_id:chatId});
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/allchatcount",async(req,res)=>{
    try {
        const result = await Charts.find().countDocuments();
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/usercount",async(req,res)=>{
    try {
        const result = await UserDetails.find().countDocuments();
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/msgcount",async(req,res)=>{
    try {
        const result = await Messages.find().countDocuments();
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/groupchatcount",async(req,res)=>{
    try {
        const result = await Charts.find({groupchat:true}).countDocuments();
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


app.get("/privatechatcount",async(req,res)=>{
    try {
        const result = await Charts.find({groupchat:false}).countDocuments();
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.post("/adminlogin",async(req,res)=>{
    try {
        const key = req.body.secretKey;
        if(key===process.env.ADMIN_SECRET_KEY){
            const token = jwt.sign({role:"admin"},process.env.ADMIN_SIGN);
            res.cookie("admin",token,{
                    expires:new Date(Date.now()+5000000),
            });
            res.status(201).send("SUCESS");
        }else{
            res.status(404).send("FAILURE");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

app.get("/adminaccess",adminAuth,(req,res)=>{
    try {
        res.status(200).send("VALID LOGIN");
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get("/logoutadmin",(req,res)=>{
    try {
        res.clearCookie('admin');
        res.status(200).send("Sucessfully Deleted Admin Cookie");
    } catch (error) {
        res.status(500).send(error);
        
    }
})
app.get("/chatallmsg/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Messages.find({chartlinked:id}).populate("sender chartlinked");
        const safeMessage = result.map((msg)=>{
            if(!msg.sender){
                msg.sender = {
                    _id:null,
                    username:"Deleted User"
                }
            }
            return msg;
        })
        res.status(201).send(safeMessage);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// app.get("/logoutadmin",async(req,res)=>{
//     try {
//         res.clearCookie("admin");
//         res.status(201).send("Sucess");
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
// })

app.get("/checkreq/:id",async(req,res)=>{
    try {
        const id = req.params.id;

        const result = await Requests.find({$or:[{sender:id},{receiver:id}],status: { $in: ['pending', 'accepted'] }});
        const relatedUserIds = new Set();

        result.forEach(req => {
            relatedUserIds.add(req.sender.toString());
            relatedUserIds.add(req.receiver.toString());
        });

        relatedUserIds.add(id.toString());

        const availableUsers = await UserDetails.find({
            _id: { $nin: Array.from(relatedUserIds) }
        });


        res.status(201).send(availableUsers);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete("/deletereq/:id1/:id2",async(req,res)=>{
    const{id1,id2} = req.params;
    try {
        const result = await Requests.deleteOne({$or:[{$and:[{sender:id1},{receiver:id2}]},{$and:[{sender:id2},{receiver:id1}]}]});
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
    }
})

app.delete("/deletemsg/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await Messages.deleteMany({chartlinked:id});
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
    }
})

app.delete("/removereq/:userId",async(req,res)=>{
    try {
        const userId = req.params.userId;
        const result = await Requests.deleteMany({$or:[{sender:userId},{$and:[{receiver:userId},{status:"accepted"}]}]});
        res.status(200).send(result);
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// module.exports = app;


server.listen(port,()=>{
    console.log("Its is RUNNING on Port NUmber"+port);
})


