import { useEffect, useState } from "react";
import { deleteMessages, deleteMyGroup, deleteUser, exitFromGroup, getLoginData, getMyCharts, removeAllLinkedReq, userLogout } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { Error } from "./Error";
import toast from "react-hot-toast";


export const Profile= () => {

  const[loginData,setLoginData] = useState({});
  const navigate = useNavigate();

  //Validation 
  const[isValidated,setValidate] = useState(false);

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

  const handleLogoutUser = async () => {
    try {
      const res = await userLogout();
      if(res.status===200){
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeleteUser = async() => {
    try {
        if(loginData._id!=null || loginData._id!=undefined){
          const res1 = await getMyCharts(loginData._id);

          const privateChats = res1.data.filter((curr)=>{
              return (curr.groupchat===false || curr.members.length<=3);
          })
          
          const validGroups = res1.data.filter((obj1 )=>{
                return !privateChats.some((obj2) => {
                  return obj2._id === obj1._id
                })
            }
          );
          
          const updatedChats = validGroups.map(chat => {
            const updatedMembers = chat.members.filter(m => m._id !== loginData._id);

            return {
              ...chat,
              members: updatedMembers,
              creator: chat.creator == loginData._id 
                ? updatedMembers[0]._id  // assign first remaining member as creator
                : chat.creator
            };
          });

          // DELETE ALL MESSAGES OF PRIVATE CHATS

          const res4 = await Promise.all(privateChats.map((curr)=>{
                return deleteMessages(curr._id);
          }))

          const allSuccess2 = res4.every(r=> r.status===201);


          // REMOVE PRIVATE CHATS
          const res2 = await Promise.all(privateChats.map((curr)=>{
              return deleteMyGroup(curr._id);
          }))


          const allSuccess = res2.every(r => r.status === 200);
          // UPDATE GROUP CHATS
          const res3 = await Promise.all(updatedChats.map((curr)=>{
              return exitFromGroup(curr._id,curr);
          }))

          const allSuccess1 = res3.every(r=> r.status===200);


          const res5 = await removeAllLinkedReq(loginData._id);

          const res = await deleteUser(loginData._id);



          if(allSuccess && allSuccess1 && allSuccess2 && res5.status===200 && res.status===201){
                navigate("/register");
                toast.success("Account Deleted");
          }else{
                toast.error("Could Not Delete Account");
          }
                    
        }
    } catch (error) {
      console.log(error);
      
    }
  }
  
  if(isValidated){
  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 w-full max-w-md rounded-xl shadow-xl p-8">
       {/* Profile Image */}
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-blue-500 shadow-md mb-4">
          {
            loginData.profileimage!=="" && <img
            src={loginData.profileimage} // replace with your user's avatar URL
            alt="Profile"
            className="w-full h-full object-cover"
          />
          }
          {
            loginData.profileimage==="" && <CgProfile className="w-full h-full object-cover"/>
          }
        </div>
        {/* User Info */}
        <h2 className="text-2xl font-semibold">{loginData.username}</h2>
        <p className="text-gray-400 mt-1">{loginData.email}</p>
      </div>


        {/* Action Buttons */}
        <div className="mt-8 flex flex-col space-y-4">
          <button
            className="w-full bg-red-600 hover:bg-red-700 transition duration-300 rounded-md py-2 font-medium"
            onClick={handleDeleteUser}
          >
            Delete Account
          </button>
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 transition duration-300 rounded-md py-2 font-medium"
            onClick={handleLogoutUser}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
    </>
  );}
  else{
    return (<Error />)
  }
};


