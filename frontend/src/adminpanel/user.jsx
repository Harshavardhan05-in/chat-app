import { useEffect, useState } from "react";
import { getAdminAccess, getAllUserDetails, getChatCount, getLoginData, getMyFrndCount } from "../services/apiService";
import { CgProfile } from "react-icons/cg";

import {useNavigate} from "react-router-dom";
import { AdminError } from "../Pages/AdminError";

export const AllUsers = () => {

  const[allUsers,setAllUsers] = useState([]);
  const[countData,setCountData] = useState([]);
  const[countChat,setCountChat] = useState([]);
  const[isAdmin,setIsAdmin] = useState(false);
  const adminaccessTest = async() => {
    try {
          const res = await getAdminAccess();
          if(res.status===200){
            setIsAdmin(true);
          }else{
            setIsAdmin(false);
          }
      } catch (error) {
        console.log(error);
        setIsAdmin(false);
      }

  }

  useEffect(()=>{
      adminaccessTest();
  },[])

  const navigate = useNavigate();

  const getAllUsersDataFromDb = async() => {
    try {
        const res = await getAllUserDetails();
        if(res.status===200){
          setAllUsers(res.data);
        }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    getAllUsersDataFromDb();
  },[])


  const getAllMyFriendsData = async () => {
    try {
      if(allUsers.length==0){
        return ;
      }
      const result = await Promise.all( allUsers.map(async(curr)=>{
        const res = await getMyFrndCount(curr._id);
        return {id:curr._id,count:res.data};
      }))

      const modifedRes ={};
      result.map(({id,count})=>{
        modifedRes[id] = count;
      })
      setCountData(modifedRes);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllMyFriendsData();
  },[allUsers])

  const getAllMyChatCount = async() => {
    try {
      if(allUsers.length===0){
        return ;
      }
      const res = await Promise.all(allUsers.map(async(curr)=>{
        const result = await getChatCount(curr._id);
        return {id:curr._id,count:result.data};
      }))

      const myRes = {};
      res.map((curr)=>{
        myRes[curr.id] = curr.count;
      })
      setCountChat(myRes);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllMyChatCount();
  },[allUsers])

  if(isAdmin){
  return (
    <div className="p-4 text-white bg-[#0f172a] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">All Users</h2>

      <div className="overflow-x-auto bg-[#1e293b] rounded-xl shadow-lg">
        <table className="min-w-[900px] w-full text-sm text-left">
          <thead className="bg-[#334155] text-gray-200 uppercase">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Avatar</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Friends</th>
              <th className="px-6 py-3">Groups</th>
            </tr>
          </thead>
          <tbody>
            { countData.length!==0 && allUsers.map((user) => {

              
              return (
              <tr
                key={user._id}
                className="border-b border-[#475569] hover:bg-[#334155]"
              >
                <td className="px-6 py-4">{user._id}</td>
                <td className="px-6 py-4">
                  {
                    user.profileimage==="" && <CgProfile className="w-10 h-10 rounded-full" />
                  }
                  {
                    user.profileimage!=="" &&   <img
                    src={user.profileimage}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  }
                
                </td>
                <td className="px-6 py-4">@{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{countData[user._id] || 0}</td>
                <td className="px-6 py-4">{countChat[user._id] || 0}</td>


              </tr>
            )})}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-10">
      <button onClick={()=>navigate(-1)} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 font-semibold text-lg">
        Go Back
      </button>
    </div>
    </div>
  );
}else{
  return <AdminError />
}
};
