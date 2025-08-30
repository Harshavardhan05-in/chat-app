 import {  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, } from "recharts";
  import { FiUsers, FiMessageSquare, FiLogOut, FiSearch } from "react-icons/fi"; 
  import { BsChatDots } from "react-icons/bs"; 
  import { MdDashboard } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {getAdminAccess, getAllChatCount, getGroupChatCount, getMessages, getMsgCount, getPrivateChatCount, getUserCount, logoutAdmin} from "../services/apiService"
import { AdminError } from "../Pages/AdminError";
import toast from "react-hot-toast";

const COLORS = ["#f87171", "#a78bfa"];

export const Dashboard = () => {

  const navigate = useNavigate();

  const[chatCount,setChatCount] = useState(0);
  const[userCount,setUserCount] = useState(0);
  const[msgCount,setMsgCount] = useState(0);
  const[isAdmin,setIsAdmin] = useState(false);
  const[groupChat,setGroupChat] = useState(0);
  const[privateChat,setPrivateChat] = useState(0);

  const[dayMessages,setdayMessages] = useState({
    day1:0,
    day2:0,
    day3:0,
    day4:0,
    day5:0,
    day6:0,
    day7:0,
  })

  
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
  const[data,setData] = useState([]);

  const[dateDetails,setDateDetails] = useState({});


  const pieData = [ 
    { name: "Group Chats", value: groupChat }, 
    { name: "Private Chats", value: privateChat}, 
 ];

  const setDateMessages = () => {
  const today = new Date();
  const resultDate = {};
  for (let i = 1; i < 8; i++) {
    const changeDate = new Date(today); // create new Date each iteration to avoid mutation issues
    changeDate.setDate(today.getDate() - i);

    // helper to pad with leading zero
    const pad = (num) => num.toString().padStart(2, '0');

    const day = pad(changeDate.getDate());
    const month = pad(changeDate.getMonth() + 1); // getMonth is zero-based
    const year = changeDate.getFullYear();

    const modifiedDate = `${day}/${month}/${year}`; // format as DD/MM/YYYY

    resultDate[i] = modifiedDate;
  }
  setDateDetails(resultDate);
}

  useEffect(()=>{
    setDateMessages();
  },[])
  

  const getAllMessagesDetails = async() => {
    if(dateDetails.length===0){
      return ;
    }
    try {
      const res = await getMessages();
      if(res.status===201){
        res.data.map((curr)=>{

          if(curr.date.includes(dateDetails["1"])){
            setdayMessages((prev)=>({...prev,day7:prev.day7+1}))
          }else if(curr.date.includes(dateDetails["2"])){
            setdayMessages((prev)=>({...prev,day6:prev.day6+1}))
          }else if(curr.date.includes(dateDetails[3])){
            setdayMessages((prev)=>({...prev,day5:prev.day5+1}))
          }else if(curr.date.includes(dateDetails[4])){
            setdayMessages((prev)=>({...prev,day4:prev.day4+1}))
          }else if(curr.date.includes(dateDetails[5])){
            setdayMessages((prev)=>({...prev,day3:prev.day3+1}))
          }else if(curr.date.includes(dateDetails[6])){
            setdayMessages((prev)=>({...prev,day2:prev.day2+1}))
          }else if(curr.date.includes(dateDetails[7])){
            setdayMessages((prev)=>({...prev,day1:prev.day1+1}))
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
      getAllMessagesDetails();
  },[dateDetails])


  const getAllChatCountDetails = async() => {
    try {
      const res = await getAllChatCount();
      if(res.status==201){
        setChatCount(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllChatCountDetails();
  },[])

  const getUserCountFromDb = async() => {
    try {
      const res = await getUserCount();
      if(res.status==201){
        setUserCount(res.data);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getUserCountFromDb();
  },[])

  const getAllMessagesCount = async() => {
    try {
      const res = await getMsgCount();
      if(res.status==201){
        setMsgCount(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllMessagesCount();
  })

  const getGoupChatCountFromDb = async() => {
    try {
      const res = await getGroupChatCount();
      if(res.status==201){
        setGroupChat(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getGoupChatCountFromDb();
  },[])

  const getPrivateChatCountFromDb = async() => {
    try {
      const res = await getPrivateChatCount();
      if(res.status==201){
        setPrivateChat(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getPrivateChatCountFromDb();
  },[])

  useEffect(()=>{
     if(dayMessages){
    const formattedData = Object.entries(dayMessages).map(([key,value])=>({
      name:key,
      messages:value
    }))
    setData(formattedData);
  }

  },[dayMessages])

  const handlelogOutAdmin = async() => {
    try {
        const res = await logoutAdmin();
        if(res.status===200){
          navigate("/admin");
          toast.success("Logout SucessFull");
        }else{
          toast.error("Logout Unsucessful ");
        }
    } catch (error) {
      console.log(error);
      toast.error("Connection TimedOut");
    }
  }

  if(isAdmin){
  return (
     <div className="flex flex-col sm:flex-row min-h-screen bg-[#0f172a] text-white">
     <aside className="w-full sm:w-64 bg-[#1e293b] p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-white mb-10">CHATTU</h1> 
      <nav className="flex flex-col gap-4"> <button className="bg-[#0f172a] text-white p-3 rounded-full flex items-center gap-3 font-semibold">
         <MdDashboard /> Dashboard </button> 
         <NavLink to="/admin/users" >
         <button className="flex items-center gap-3 hover:bg-gray-900 p-4 rounded"> <FiUsers /> Users </button>
         </NavLink>
         <NavLink to="/admin/groups">
          <button className="flex items-center gap-3 hover:bg-gray-900 p-4 rounded"> <BsChatDots /> Groups </button> 
         </NavLink>
         <NavLink to="/admin/message">
          <button className="flex items-center gap-3 hover:bg-gray-900 p-4 rounded"> <FiMessageSquare /> Messages </button> 
         </NavLink>
         <NavLink >
          <button className="flex items-center gap-3 hover:bg-gray-900 p-4 rounded" onClick={handlelogOutAdmin}> <FiLogOut /> Logout </button> 
         </NavLink>
         </nav> 
      </aside>

{/* Main content */}
  <main className="flex-1 p-4 sm:p-6 space-y-6">
    {/* Top bar */}
    <div className="flex justify-between items-center">
      {/* <div className="flex items-center bg-[#1e293b] p-3 rounded-lg w-full max-w-xl">
        {/* <input
          className="bg-transparent outline-none w-full text-white placeholder:text-gray-400"
          placeholder="Search..."
        /> */}
        {/* <FiSearch className="text-white" /> */}
      {/* </div> */} 
      <div className="text-gray-200 hidden sm:block">{new Date().toDateString()}</div>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#1e293b] p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Last Messages</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip contentStyle={{ backgroundColor: '#334155', color: '#fff' }} />
            <Line type="monotone" dataKey="messages" stroke="#a78bfa" fill="#a78bfa" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1e293b] p-5 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Chats Overview</h2>
        <ResponsiveContainer width="100%" height={270}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip contentStyle={{ backgroundColor: '#334155', color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#1e293b] p-6 rounded-2xl shadow-md flex flex-col items-center">
        <FiUsers className="text-3xl mb-2" />
        <p className="text-2xl font-bold">{userCount}</p>
        <span className="text-gray-400">Users</span>
      </div>
      <div className="bg-[#1e293b] p-6 rounded-2xl shadow-md flex flex-col items-center">
        <BsChatDots className="text-3xl mb-2" />
        <p className="text-2xl font-bold">{chatCount}</p>
        <span className="text-gray-400">Chats</span>
      </div>
      <div className="bg-[#1e293b] p-6 rounded-2xl shadow-md flex flex-col items-center">
        <FiMessageSquare className="text-3xl mb-2" />
        <p className="text-2xl font-bold">{msgCount}</p>
        <span className="text-gray-400">Messagees</span>
      </div>
    </div>
  </main>
</div>

);}else{
  return <AdminError />
}
 };
