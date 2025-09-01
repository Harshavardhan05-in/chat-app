import { useEffect } from "react";
import { getLoginData, getMyCharts } from "../services/apiService";
import { useState } from "react";
import { Error } from "./Error";
import { NavLink, useNavigate} from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdGroupAdd, MdGroups, MdNotificationsActive } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";


export const Home = () => { 

  const[loginData,setLoginData] = useState({});

  console.log("INSIDE HOME PAGE");

  //Validation 
  const[isValidated,setValidate] = useState(false);
  const[allCharts,setAllCharts] = useState([]);
  const navigate = useNavigate();

  const[inputvalue,setInputValue] = useState("")

  const getUserLoginDetails = async()=>{
    console.log("INSIDE USER LOGIN DETAILS FUnCTION");
    try {
      const res = await getLoginData();
      console.log("USER LOGIN DETAILS:",res);

      if(res.status===200){
        setLoginData(res.data);
        setValidate(true);
      }
    } catch (error) {
      setValidate(false);
      console.log("USER LOGIN DETAILS ERROR:",error);
    }
  }
  useEffect(()=>{
    getUserLoginDetails();
  },[])

  const getAllMyCharts = async() => {
     if(loginData._id!==undefined){
          try {
            console.log("GET ALL CHARTS DATA:",res);
            const res = await getMyCharts(loginData._id);
            if(res.status===200){
              res.data.map((curr)=>{
                if(curr.groupchat==false){
                  curr.members.map((ele)=>{
                    if(ele._id!==loginData._id){
                        curr.name=ele.username
                    }
                  })
                }
              })
              setAllCharts(res.data);
            }
            
          } catch (error) {
            console.log("GET ALL CHARTS ERROR :",error);

          }
     }
  }

  useEffect(()=>{
    getAllMyCharts();
  },[loginData])

  const handleOpenChat = (curr) => {
    navigate(`/chat/${curr._id}`)
    
  }


  const SearchArray = allCharts.filter((curr)=>{
    return curr.name.toLowerCase().includes(inputvalue.toLowerCase());
  })


  if(isValidated){
    if(allCharts.length===0){ return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
          <header className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white-800"> HV.....</h1>

          <div className="flex items-center space-x-5">
            <NavLink to="/adduser">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                      Request
                </button>
            </NavLink>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:scale-105 transition">
              <NavLink to="/modifygroups">
                    <MdGroups className="w-full h-full object-cover"/>
              </NavLink>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:scale-105 transition">
              <NavLink to="/creategroup">
                <MdGroupAdd className="w-full h-full object-cover " />
              </NavLink>
            </div>

            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:scale-105 transition">
              <NavLink to="/notification">
            <MdNotificationsActive className="w-full h-full object-cover"/>
              </NavLink>
            </div>
            

            {/* Profile Icon */}
            <NavLink to="/profile">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:scale-105 transition">
              
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

            </NavLink>
            
          </div> 
        </header>

        {/* Search bar */}
          <div className="mb-5">  
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                value={inputvalue}
                onChange={(e)=>setInputValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
          <div className="flex items-center justify-center h-screen bg-gray-900">
          <h1 className="text-5xl font-extrabold text-white tracking-wide -mt-[180px]">
            No Friends or Chats Added
          </h1>
        </div>
  </div>
    )
  }
    
  return ( 
  <div className="min-h-screen bg-gray-900 text-white p-4">
  <header className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-white-800"> HV.....</h1>

      <div className="flex items-center space-x-4">
        {/* Request Box/Button */}
        <NavLink to="/adduser">
           <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Request
            </button>
        </NavLink>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:scale-105 transition">
          <NavLink to="/modifygroups">
                <MdGroups className="w-full h-full object-cover"/>
          </NavLink>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:scale-105 transition">
              <NavLink to="/creategroup">
                <MdGroupAdd className="w-full h-full object-cover " />
              </NavLink>
            </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:scale-105 transition">
          <NavLink to="/notification">
        <MdNotificationsActive className="w-full h-full object-cover"/>

          </NavLink>
        </div>
        

        {/* Profile Icon */}
        <NavLink to="/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer hover:scale-105 transition">
          
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

        </NavLink>
        
      </div>
    </header>

{/* Search bar */}
  <div className="mb-5">  
    <div className="relative">
      <input
        type="text"
        placeholder="Search contacts..."
        value={inputvalue}
        onChange={(e)=>setInputValue(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
    </div>
  </div>

  {/* Contact list */}
        
  <div className="space-y-4" >
    { allCharts && SearchArray.map((curr)=>{
      let otheruser;
      if(curr.groupchat){
          otheruser=curr.name;
      }else{
        otheruser = curr.members.find((ele)=>{
          return ele._id!==loginData._id;
        })
      }

      if(curr.groupchat) {
        return (<div
        onClick={()=>handleOpenChat(curr)}
         key={curr._id}
        className="flex items-center gap-3 p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
      >
        <div className="w-12 h-12 bg-gray-600 rounded-full">
          <FaUsers className="w-12 h-12 bg-gray-600 rounded-full"/>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{otheruser}</h2>
          <p className="text-sm text-gray-400">Last message preview...</p>
        </div>
      </div>
      )
      // Personal Chats
    }else{
      return (
            <div
        onClick={() => handleOpenChat(curr)}
        key={curr._id}
        className="flex items-center justify-between gap-3 p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer w-full"
      >
        {/* Div 1: Left Side (Image + Text) */}
        <div className="flex items-center gap-3">
          {otheruser.profileimage === "" ? (
                  <IoPersonCircle className="w-12 h-12 bg-gray-600 rounded-full" />
          ) : (
            <img
              src={otheruser.profileimage}
              className="w-12 h-12 bg-gray-600 rounded-full"
              alt="Profile Image"
            />
          )}
          <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{otheruser.username}</h2>
          <p className="text-sm text-gray-400">Last message preview...</p>
        </div>
  </div>

  {/* Div 2: Right Side */}
  {
    otheruser.isonline?<div className="w-3 h-3 bg-green-500 rounded-full"></div>:<div className="w-3 h-3 bg-red-500 rounded-full"></div>
  }
  
</div>
)

    }
      
    })
    
    }
  </div>
</div>

); }
  else{
    return <Error />;
  }
}