import { FaUserCircle } from "react-icons/fa";
import { addNewRequest, getLoginData, getNonReqUsers } from "../services/apiService";
import { useEffect } from "react";
import { useState } from "react";
import { Error } from "./Error";
import {toast} from "react-hot-toast";


export const RequestPage = () => {

  const[inputValue,setInputValue] = useState("")

  const[loginData,setLoginData] = useState({});
  //Validation 
  const[isValidated,setValidate] = useState(false);
  const[allUsers,setAllUsers] = useState([]); 

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

  const getAllData = async() => {
    try {
      if(Object.keys(loginData).length!==0){
          const res = await getNonReqUsers(loginData._id);
          if(res.status==201){
            setAllUsers(res.data);
          }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllData();
    
  },[loginData])

  const searchList = allUsers.filter((curr)=>{
    return curr.username.toLowerCase().includes(inputValue.toLowerCase());
  })
  

  const handleNewRequest = async(user) => {
    try {
      const reqInfo = {
        sender:loginData._id,
        receiver:user._id,
      }
      const res = await addNewRequest(reqInfo);
      if(res.status===200){
          const updatedList = allUsers.filter((curr)=>{
            return curr._id!==res.data.receiver;
          })
          setAllUsers(updatedList);
          toast.success("Request Sent!")
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to Send Request");
    }

  }
  
  // if(isValidated){
  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Connect with Users</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={inputValue}
          onChange={(e)=>setInputValue(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* User Cards */}
      {
        searchList.length===0?<div className="h-[60vh] w-[97vw] flex items-center justify-center ">
      <h1 className="text-4xl font-bold text-gray-400">
        No Users Found! Please,try again After some Time.
      </h1>
    </div>:<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {
          searchList.map((user) => (
            <div
              key={user._id}
              className="bg-zinc-800 p-6 rounded-xl shadow-md flex flex-col items-center gap-3 hover:shadow-xl transition"
            >
              {
                  user.profileimage==="" && <FaUserCircle className="w-25 h-25 rounded-full object-cover" />
              }
              {
                  user.profileimage!=="" && <img src={user.profileimage} className="w-25 h-25 rounded-full object-cover" />
              }
              <p className="text-lg font-medium">{user.username}</p>
              <button
                className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-full text-sm font-semibold"
                onClick={()=>handleNewRequest(user)}
              >
                Send Request
              </button>
            </div>
          ))
          }
      </div>
      }
      
    </div>
  )}
  // else{
  //   return (<Error />)
  // }
// };
