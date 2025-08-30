
const app = require("./index.js");

const {Server} = require("socket.io");
const http = require('http');
const server = http.createServer(app);

const cors = require('cors');
const UserDetails = require("./models/LogInSchema.js");
app.use(cors());

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    }

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


const port = process.env.PORT || 5000 ;


server.listen(port,()=>{
    console.log("Its is RUNNING on Port NUmber"+port);
})