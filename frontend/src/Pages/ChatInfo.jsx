import { useNavigate, useParams } from "react-router-dom"
import { deleteMessages, deleteMyGroup, deleteRequest, getLoginData, getOpenedChatDetails } from "../services/apiService";
import { useEffect, useState } from "react";
import { MdGroups } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import {toast} from "react-hot-toast";
import { Error } from "./Error";


export const ChatInfo = () => {

    const params = useParams();
    const chatId = params.chatId;

    const navigate = useNavigate();

    const[loginData,setLoginData] = useState({});
    const[isValidated,setValidate] = useState(false);
    const[chatDetils,setChatDetails] = useState({});
    const[otherUser,setOtherUser] = useState({})

    const getUserLoginDetails = async()=>{
    try {
      const res = await getLoginData();

      if(res.status===200){
        setLoginData(res.data);
        setValidate(true);
      }
    } catch (error) {
      console.log(error);
      setValidate(false);
    }
  }
  useEffect(()=>{
    getUserLoginDetails();
  },[])

    const getCurrChatInfo = async() => {
        try {
            const res = await getOpenedChatDetails(chatId);
            if(res.status===200){
              setChatDetails(res.data[0]);
              if(loginData._id===undefined) return ;
              if(res.data[0].groupchat===false){
                res.data[0].members.map((curr)=>{
                    if(curr._id!==loginData._id){
                      setOtherUser(curr);
                    }
                })
              }
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(()=>{
        getCurrChatInfo();
    },[loginData]);

    const handleRemoveRequest = async(user) => {
      try {
         const res = await deleteRequest(loginData._id,user._id);
         const res1 = await deleteMyGroup(chatDetils._id);
         const res2 = await deleteMessages(chatDetils._id);
         if(res.status===201 && res1.status===200 && res2.status===201){
            navigate("/");
            toast.success("User Removed");
         }
      } catch (error) {
        console.log(error);
      }
    }

  if(isValidated){
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-100 to-indigo-100 p-8 flex flex-col items-center justify-start">
      {
        chatDetils && (chatDetils.groupchat?<div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 shadow-2xl rounded-3xl w-full max-w-3xl p-10 text-white">
        {/* Group Icon */}
        <div className="flex justify-center mb-6">
          <MdGroups className="w-28 h-28 rounded-full border-4 border-white shadow-lg"/>
        </div>

        {/* Group Name */}
        <h1 className="text-4xl font-extrabold text-center mb-6">
          {chatDetils.name}
        </h1>

        {/* Admin Info */}
        <div className="flex items-center justify-center space-x-4 mb-10">
          {
            chatDetils.creator.profileimage===""?<CgProfile className="w-14 h-14 rounded-full border-2 border-white shadow-md"/>:<img
            src={chatDetils.creator.profileimage}
            alt="Admin"
            className="w-14 h-14 rounded-full border-2 border-white shadow-md"
          />
          }
          
          <div className="text-lg font-semibold">Admin: {chatDetils.creator.username}</div>
        </div>

        {/* Group Members List */}
        <div className="bg-purple-100 rounded-xl p-4 max-h-80 overflow-y-auto shadow-inner">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Group Members
          </h2>
          <ul className="space-y-4">
            {chatDetils.members.map((member, index) => (
              <li key={index} className="flex items-center space-x-4">
                {
                  member.profileimage===""?<CgProfile className="w-12 h-12 rounded-full bg-yellow-500 border border-gray-300"/>:<img
                  src={member.profileimage}
                  alt={member.username}
                  className="w-12 h-12 rounded-full border border-gray-300"
                />
                }
                <span className="text-gray-800 font-medium">{member.username}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      :<div className="bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 shadow-2xl rounded-3xl w-full max-w-2xl p-10 text-white" > {
        otherUser && <div className="bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 shadow-2xl rounded-3xl w-full max-w-2xl p-10 text-white">
        <div className="flex justify-center mb-8">
          {
            otherUser.profileimage===""?<CgProfile  className="w-36 h-36 rounded-full border-4 border-white shadow-xl"/>:<img
            src={otherUser.profileimage}
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-white shadow-xl"
          />
          }
          
        </div>

        {/* User Info */}
        <div className="text-center space-y-5">
          <h1 className="text-4xl font-extrabold">{otherUser.username}</h1>
          <p className="text-lg">{otherUser.email}</p>

          <div className="flex justify-center items-center space-x-2">
            <span
              className={`h-3 w-3 rounded-full ${
                otherUser.isonline ? 'bg-green-300' : 'bg-red-800'
              }`}
            ></span>
            <span className="text-md font-medium">
              {otherUser.isonline ? 'Online' : 'Offline'}
            </span>
          </div>

          <p className="text-sm">
            Registered On : {new Date(otherUser.loginDate).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex justify-center space-x-6">
          <button className="bg-white text-red-600 hover:bg-red-100 px-6 py-2 rounded-full font-bold shadow-lg transition" onClick={()=>handleRemoveRequest(otherUser)}>
            UnFriend
          </button>
        </div>
      </div>
      }
        </div>
      
      )
      }
    </div>
  );}else{
    return (<Error />)
  }
};

