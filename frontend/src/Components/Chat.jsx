import { useNavigate, useParams } from "react-router-dom";
import { addNewMessages, getAllMessageDetails, getLoginData, getOpenedChatDetails } from "../services/apiService";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { FaImages } from "react-icons/fa";
import { LiaVideoSolid } from "react-icons/lia";
import { VscFileSubmodule } from "react-icons/vsc";
import toast from "react-hot-toast";
import {io} from "socket.io-client"
import { Error } from "../Pages/Error";
import { TiGroup } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";


export const Chat = () =>{

  const params = useParams();
  const [currChat,setCurrChat] = useState({});

  const[loginData,setLoginData] = useState({});
  const[socket,setSocket] = useState(null);
  

  //Validation 
  const[isValidated,setValidate] = useState(false);

  const[messages,setMessages] = useState([]);

  const[lastseenInfo,setLastseenInfo] = useState("");
  const[timeStamp,setTimeStamp] = useState("");

  const[otherMem,setOtherMem] = useState({});

  const messageEndRef = useRef(null);

  const navigate = useNavigate();

  const getUserLoginDetails = async()=>{
    try {
      const res = await getLoginData();

      if(res.status===200){
        setLoginData(res.data);
        setValidate(true);
        const mysocket = io(process.env.REACT_APP_BACKEND_URL,{
        transports:['websocket'],
        withCredentials:true,
        query:{userId:res.data._id}
        })  
        setSocket(mysocket);

      }
    } catch (error) {
      console.log(error);
      setValidate(false);
    }
  }
  useEffect(()=>{
    getUserLoginDetails();
  },[])

  // Helper to format the time ago
  const getTimeAgo = (timestamp) => {
    const last = new Date(timestamp);
    const now = new Date();
    const diffMs = now - last;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  };

  useEffect(() => {
    if(!timeStamp) return ;
    // Initial calculation
    setLastseenInfo(getTimeAgo(timeStamp));

    // Recalculate every minute
    const interval = setInterval(() => {
      setLastseenInfo(getTimeAgo(timeStamp));
    }, 60 * 1000);

    return () => clearInterval(interval); // Cleanup
  }, [timeStamp]); // Also rerun when the lastSeen prop changes



  const[inputValue,setInputValue] = useState("");

  const getThisChatDetails = async() => {
    if(!loginData) return ;
    try {
      const res = await getOpenedChatDetails(params.chatId);
      if(res.status===200){
        if(res.data[0].groupchat===false){
            const otherUser = res.data[0].members.find(
              (m) => m._id !== loginData._id
            );
            if (otherUser) {
              setTimeStamp(otherUser.lastseen);
            }
          // setTimeStamp(res.data[0].members[1].lastseen)

        }
        if(res.data[0].groupchat===false){
          res.data[0].members.map((curr)=>{
            if(curr._id!==loginData._id){
              res.data[0].name=curr.username;
            }
          })
        }
        setCurrChat(res.data[0]);

      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getThisChatDetails()
  },[loginData])

  const getAllChatMessages = async() => {
    if(currChat._id!==undefined){
    try {
        const res = await getAllMessageDetails(currChat._id);
        if(res.status===201){
          setMessages(res.data);
        }
    } catch (error) {
        console.log(error);
    }
  }
  } 

  useEffect(()=>{
    getAllChatMessages();
  },[currChat])

  const [open, setOpen] = useState(false);

  const imageInputRef = useRef();
  const videoInputRef = useRef();
  const fileInputRef = useRef();

  const handleImageClick = () => imageInputRef.current.click();
  const handleVideoClick = () => videoInputRef.current.click();
  const handleFileClick = () => fileInputRef.current.click();

    const compressImage = async (file) => {
      const image = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Resize image
      canvas.width = 800;
      canvas.height = (image.height / image.width) * 800;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, { type: file.type });
          resolve(compressedFile);
        }, file.type, 0.7); // 70% quality
      });
    };

  const MAX_FILESIZE = 3;

  const handleFileChange = async(e) => {
    let file = e.target.files[0];
    if (file) {
      const filesize = file.size/(1024*1024);
      if(filesize>MAX_FILESIZE){
        toast.error("The File is To large!,Unable to Upload");
      }else{
        const fileType = file.type;
        if(fileType.startsWith("image/")){
          file = await compressImage(file);
        }
        const formData = new FormData();
        formData.append("file",file);
        formData.append("upload_preset","my_preset");
        formData.append("cloud_name","dyc89dtkh");
        try { 
              let resourceType;
              if(fileType.startsWith("image/")){
                  resourceType = "image";
              }else if(fileType.startsWith("video/")){
                  resourceType = "video";
              }else{
                  resourceType = "raw";
              }
              const res = await fetch(`https://api.cloudinary.com/v1_1/dyc89dtkh/${resourceType}/upload`,{
                  method:"POST",
                  body:formData,
              })
              if(res.status==200 && res){
                const now = new Date();
                const modifiedDate = `Date: ${now.toLocaleDateString('en-GB')},Time: ${now.toLocaleTimeString('en-US')}`;
                  const data = await res.json();
                  
                  if(currChat){
                    const messageData = {
                    content:inputValue,
                    sender:loginData._id,
                    receiver:undefined,
                    chartlinked:currChat,
                    attachments:[{
                      public_id:data.public_id,
                      url:data.secure_url
                    }],
                    date:modifiedDate
                  }
                  const res1 = await addNewMessages(messageData);
                  if(res1.status===201){

                    // setMessages([...messages,res1.data]);
                    socket.emit("send_message",res1.data);
                    
                    setOpen(!open);
                  }
                }
              }
        } catch (error) {
          console.log("CONSOLE ERROR:",error);
          
        }
      }
    }
  };

  // AUTO SCROLL  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({behavior:"smooth"});
  }


  useEffect(()=>{
    if(!socket) return ;
      if(currChat._id!==undefined && loginData!==undefined){

        socket.emit("join_chat",currChat._id);

        socket.on("receive_message",(newMsg)=>{
          if(newMsg.chartlinked._id===currChat._id){
            setMessages((prev)=>[...prev,newMsg])
          }
        })

        return () => {
          socket.emit("leaveRoom",currChat._id);
          socket.off("receive_message");
        }


      }
  },[currChat,loginData,socket])


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if(inputValue===""){
        toast.error("Invalid Message");
      }else{
        const now = new Date();
        const modifiedDate = `Date: ${now.toLocaleDateString('en-GB')},Time: ${now.toLocaleTimeString('en-US')}`;

        const newMsgdata = {
          content:inputValue,
          sender:loginData._id,
          receiver:undefined,
          chartlinked:currChat._id,
          attachments:[],
          date:modifiedDate
        }
        const res = await addNewMessages(newMsgdata);
        if(res.status===201){
          //  setMessages([...messages,res.data]);
          socket.emit("send_message",res.data);
          setInputValue("");
        }

      }
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    scrollToBottom();
  },[messages])

  useEffect(()=>{
    if(loginData._id===undefined) return;
    if(currChat && currChat.groupchat===false){
          const otherUser = currChat.members.find(
               (m) => m._id !== loginData._id
          );
          setOtherMem(otherUser);
    }
  
  },[loginData,currChat])

  const parseDate = (str) => {
      const cleaned = str.replace("Date:", "").replace("Time:", "").trim();

      // 2. Split into date and time parts
      const [datePart, timePart, ampm] = cleaned.split(/[\s,]+/); // split by spaces or comma

      // 3. Break date into day, month, year
      const [day, month, year] = datePart.split("/").map(Number);

      // 4. Break time into hours, minutes, seconds
      let [hours, minutes, seconds] = timePart.split(":").map(Number);

      // 5. Convert 12-hour format to 24-hour format
      if (ampm!==undefined && ampm.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
      }
      if (ampm!==undefined && ampm.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }

      // 6. Create the Date object
      const msgDate = new Date(year, month - 1, day, hours, minutes, seconds);
      return msgDate;
 
  }


  const handleMoreInfo = () => {
      navigate(`/chat/${currChat._id}/chatInfo`);
  }

  let lastDate = null;
  if(isValidated){
    return ( 
  <div className="h-screen w-full bg-gray-900 text-white flex flex-col">
     {/* Header */} 
     <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800" > 
      <div className="flex items-center gap-3"> 
        <div className="w-10 h-10 rounded-full bg-gray-600">
          {
            currChat && (
            currChat.groupchat ? (
              <TiGroup className="w-10 h-10 rounded-full bg-gray-600" />
            ) : (
              currChat.members &&
              currChat.members.length > 1 && otherMem && 
              otherMem.profileimage !== "" ? (
                <img
                  src={otherMem.profileimage}
                  className="w-10 h-10 rounded-full bg-gray-600"
                />
              ) : (
                <CgProfile className="w-10 h-10 rounded-full bg-gray-600" />
              )
            )
          )

          }
        </div> 
        <div> 
          <h2 className="font-semibold text-white">{currChat.name}</h2> 
          <p  className="text-xs text-gray-400">{currChat.groupchat?"Group Chat":`Last seen ${lastseenInfo}`}</p> 
          </div> </div> <button onClick={handleMoreInfo} className="text-gray-400 hover:text-white text-2xl w-10 h-10 ">⋮</button> 
        </div>
  {/* Messages */}
    <div className="flex flex-col space-y-2 p-4 h-full overflow-y-auto space-y-2 bg-gray-900 p-5">
    {
      messages.map((curr)=>{


      const newMsgDate = parseDate(curr.date).toDateString();
      const isNewDate = newMsgDate!==lastDate;

      if(isNewDate){
        lastDate = newMsgDate;
      }

          const checkCloudinaryResourceType = (url, type) => {
            try {
              const urlObj = new URL(url);
              const pathParts = urlObj.pathname.split('/');

              // Typical Cloudinary structure: /<cloud_name>/<resource_type>/...
              const resourceType = pathParts[2];

              return resourceType === type;
            } catch (error) {
              console.error('Invalid URL:', error);
              return false;
            }
          }
      
        return (
            <React.Fragment key={curr._id}>
            {isNewDate && (<div key={`lable:${curr._id}`} className="text-center my-2 text-sm text-gray-400" >
              {newMsgDate}
            </div>)
            }
            
            {
            curr.chartlinked.groupchat?<div
            ref={messageEndRef}
            key={curr._id}
            className={
              (curr.sender._id === loginData._id || curr.sender === loginData._id)
                ? "relative inline-block max-w-fit px-6 pr-11 pb-6 pt-8 m-2 rounded-lg shadow-sm text-xl md:text-base leading-relaxed self-end bg-green-500 text-white rounded-br-none"
                : "relative inline-block max-w-fit  px-6 pr-11 pb-6 pt-8 m-2 rounded-lg shadow-sm text-xl md:text-base leading-relaxed self-start bg-green-600 text-white rounded-bl-none"
            }
          >
            <p className="absolute top-1 left-3 text-xs text-light-500">
              {curr.sender._id && curr.sender._id === loginData._id ?"You":`${curr.sender.username }`}
            </p>

            <p className="text-base text-black">
              {curr.content}
            </p>

            <p className="absolute bottom-1 right-2 text-[10px] mt-2 text-light-500">
              {curr.date.substring(22)}
            </p>
            {
                curr.attachments.length!==0 && (checkCloudinaryResourceType(curr.attachments[0].url,'image')?<img 
                          src={curr.attachments[0].url}
                          alt="Sample image"
                          className="w-full max-w-sm rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                                                          />:(checkCloudinaryResourceType(curr.attachments[0].url,'video')?<div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
                                    <video 
                                      controls 
                                      className="w-full h-auto rounded-lg"
                                      poster="#"
                                    >
                                      <source src={curr.attachments[0].url} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                    </div>:<a
                                    href={curr.attachments[0].url}
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                  >
                                    📄 View File (PDF)
                                  </a>
                                  )
                  )
            }
            
      </div>:<div ref={messageEndRef} key={curr._id} className={(curr.sender._id===loginData._id || curr.sender===loginData._id)?" relative inline-block max-w-[85%] px-4 pr-10 pb-6 pt-3 m-2 rounded-lg shadow-sm text-xl md:text-base leading-relaxed self-end bg-green-500 text-white rounded-br-none":" relative inline-block max-w-[85%] px-4 pr-10 pb-6 pt-3 m-2 rounded-lg shadow-sm text-text-xl md:text-base leading-relaxed self-start bg-green-600 text-white rounded-bl-none"}>
              <p className="text-base text-black">
                {curr.content}
              </p>
              <p className="absolute bottom-1 right-2 text-[10px] mt-2 text-light-500">
                {curr.date.substring(22)}
              </p>
              {
                curr.attachments.length!==0 && (checkCloudinaryResourceType(curr.attachments[0].url,'image')?<img 
                          src={curr.attachments[0].url}
                          alt="Sample image"
                          className="w-full max-w-sm rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                                                          />:(checkCloudinaryResourceType(curr.attachments[0].url,'video')?<div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
                                    <video 
                                      controls 
                                      className="w-full h-auto rounded-lg"
                                      poster="#"
                                    >
                                      <source src={curr.attachments[0].url} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                    </div>:<a
                                    href={curr.attachments[0].url}
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                  >
                                    📄 View File (PDF)
                                  </a>
                                  )
                  )
            }
          </div>

        }
          
        </React.Fragment>)
        
      })
    }
    
  </div>
  {/* Wrapper for 📎 + form */}
<div className="flex items-center p-4 border-t border-gray-700 bg-gray-800">

  {/* Attachment Button (outside the form, on the left) */}
  <div className="relative">
    <button
      onClick={() => setOpen(!open)}
      className="p-2 rounded-full hover:bg-gray-700 bg-gray-800 text-white transition"
    >
      📎
    </button>

    {/* Dropdown Menu */}
    {open && (
      <div className="absolute bottom-[65px] left-0 w-14 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
        <button
          onClick={handleImageClick}
          className="flex items-center justify-center w-full px-4 py-2 hover:bg-gray-700 text-white text-sm"
        >
          <FaImages />
        </button>
        <button
          onClick={handleVideoClick}
          className="flex items-center justify-center w-full px-4 py-2 hover:bg-gray-700 text-white text-sm"
        >
          <LiaVideoSolid />
        </button>
        <button
          onClick={handleFileClick}
          className="flex items-center justify-center w-full px-4 py-2 hover:bg-gray-700 text-white text-sm"
        >
          <VscFileSubmodule />
        </button>
      </div>
    )}

    {/* Hidden Inputs */}
    <input
      ref={imageInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />
    <input
      ref={videoInputRef}
      type="file"
      accept="video/*"
      className="hidden"
      onChange={handleFileChange}
    />
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
      className="hidden"
      onChange={handleFileChange}
    />
  </div>

  {/* Form (input + send) */}
  <form onSubmit={handleFormSubmit} className="flex flex-1 items-center ml-3">
    <input
      type="text"
      placeholder="Type a message..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
    />
    <button
      type="submit"
      className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
    >
      Send
    </button>
  </form>

</div>

</div>
)}else{
    return (<Error />);
  }
}