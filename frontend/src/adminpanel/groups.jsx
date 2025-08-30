import { useEffect } from "react";
import {getAdminAccess, getAllCharts, getAllMessages} from "../services/apiService"
import { useState } from "react";
import { MdGroups } from "react-icons/md";
import { BsFilePerson } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { AdminError } from "../Pages/AdminError";


export const AllGroups = () => {

  const navigate = useNavigate();

  const[allchats,setAllChats] = useState([]);
  const[allMsg,setAllMsg] = useState([]);
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

  const allMyCharts = async() => {
    try {
        const res = await getAllCharts();
        if(res.status===200){
          setAllChats(res.data);
        }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    allMyCharts();
  },[]);

  const getMessageCount = async() => {
    if(allchats.length===0){
      return ;
    }
    try {
      const result = await Promise.all(allchats.map(async(curr)=>{
        const res = await getAllMessages(curr._id);
        return {id:curr._id,count:res.data};
      }))

      const newRes = {};
      result.map((curr)=>{
        newRes[curr.id] = curr.count;
      })
      setAllMsg(newRes);


    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getMessageCount();
  },[allchats]);

  if(isAdmin){
  return (
    <div className="p-4 text-white bg-[#0f172a] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">All Groups</h2>

      <div className="overflow-x-auto bg-[#1e293b] rounded-xl shadow-lg">
        <table className="min-w-[1000px] w-full text-sm text-left">
          <thead className="bg-[#334155] text-gray-200 uppercase">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Avatar</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Total Members</th>
              <th className="px-6 py-3">Members</th>
              <th className="px-6 py-3">Total Messages</th>
              <th className="px-6 py-3">Created By</th>
            </tr>
          </thead>
          <tbody>
            {allchats.map((curr) => (
              <tr
                key={curr._id}
                className="border-b border-[#475569] hover:bg-[#334155]"
              >
                <td className="px-6 py-4">{curr._id}</td>
                <td className="px-6 py-4">
                 <MdGroups 
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="px-6 py-4">{curr.name}</td>
                <td className="px-6 py-4">{curr.members.length}</td>
                <td className="px-6 py-4 flex gap-2">
                  {curr.members.slice(0,3).map((currData)=>{
                    return (<div key={currData._id}>
                      
                      {
                        currData.profileimage!==""  && <img
                            src={currData.profileimage}
                            alt={`member-${currData._id}`}
                            className="w-8 h-8 rounded-full"
                        />
                      }
                      {
                        currData.profileimage==="" && <BsFilePerson className="w-8 h-8 rounded-full" />
                      }
                    </div>
                    
                    )
                  })}
                </td>
                <td className="px-6 py-4">{allMsg[curr._id]}</td>
                <td className="px-6 py-4">{curr.creator}</td>
              </tr>
            ))}
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
