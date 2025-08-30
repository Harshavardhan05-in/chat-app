import { useEffect, useState } from 'react';
import { getLoginData, getAllUserDetails, addGroupdata } from '../services/apiService';
import { FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Error } from "./Error";

export const GroupBuilderPage = () => {


  const[loginData,setLoginData] = useState({});
  //Validation 
  const[isValidated,setValidate] = useState(false);
  const[allUsers,setAllUsers] = useState([]); 
  const[allValidUsers,setAllValidUsers] = useState([]);

  const[groupName,setGroupName] = useState("");
  const[groupMembers,setGroupMembers] = useState([]);

  const getUserLoginDetails = async()=>{

    try {
      const res = await getLoginData();

      if(res.status===200){
        setLoginData(res.data);
        setValidate(true);
        // setGroupMembers([...groupMembers,res.data._id])
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
      const res = await getAllUserDetails();
      if(Object.keys(loginData).length!==0){
        const updatedList = res.data.filter((curr)=>{
          return loginData._id!==curr._id;
        })
        setAllUsers(updatedList);
        setAllValidUsers(updatedList);
      
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllData();
    
  },[loginData])

  const [search, setSearch] = useState('');
  const [group, setGroup] = useState([]);

  const handleAdd = (user) => {
    if (!group.find((u) => u._id === user._id)) {
      setGroup([...group, user]);
    }
    if(!groupMembers.find((u)=>u==user._id)){
        setGroupMembers([...groupMembers,user._id]);

        const updatedList = allUsers.filter((curr)=>{
          return curr._id!==user._id;
        })

        setAllUsers(updatedList);
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const createGroup = async() => {
    const userAddedList = [...groupMembers,loginData._id];
    const groupInfo = {
      name:groupName || "friends",
      groupchat:true,
      creator:loginData._id,
      members:userAddedList
    }
    try {
      const res = await addGroupdata(groupInfo);
      if(res.status===201){
        setGroupName("");
        setGroup([]);
        setGroupMembers([]);
        setAllUsers(allValidUsers);
        toast.success("Group Created");
      }
    } catch (error) {
      console.log(error);
    }

  }

  const handleRemoveUser = (user) => {
    const updatedGroupMembers = group.filter((curr)=>{
      return curr._id!==user._id;
    })
    setGroupMembers(updatedGroupMembers);
    setGroup(updatedGroupMembers);
    setAllUsers([...allUsers,user]);

  }


  if(isValidated){

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Create a Group</h1>

      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-3 rounded bg-gray-800 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">User List</h2>
          {filteredUsers.length===0?<h1> No Users Found </h1>:filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded mb-3"
            >
              <div className="flex items-center space-x-4">
                {
                    user.profileimage==="" && <FaUserCircle className="w-12 h-12 rounded-full" />
                }
                {
                    user.profileimage!=="" && <img
                  src={user.profileimage}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                }
                <span className="text-lg">{user.username}</span>
              </div>
              <button
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1 rounded text-sm"
                onClick={() => handleAdd(user)}
              >
                Add
              </button>
            </div>
          ))}
        </div>

        <div>
          <input
          id="group-name"
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e)=>setGroupName(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-800 mb-[10px] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          <h2 className="text-xl font-semibold mb-3">Group Members</h2>
          {group.length === 0 ? (
            <p className="text-gray-400 mb-[10px]">No members added yet.Add minium of Two Members</p>
          ) : (
            group.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center space-x-4 bg-gray-800 p-4 rounded mb-3"
              >
                 <div className="flex items-center space-x-3">
                  {user.profileimage === "" ? (
                    <FaUserCircle className="w-12 h-12 rounded-full" />
                  ) : (
                    <img
                      src={user.profileimage}
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <span className="text-xl">{user.username}</span>
                          </div>
              <button onClick={()=>handleRemoveUser(user)} className="bg-gray-700 text-white px-5 py-2 rounded shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 ease-in-out" >
                    Remove              
                </button>
            </div>
            ))
          )}
          <div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded shadow transition" disabled={group.length<=1} onClick={createGroup}>
                 {group.length<=1?"Insufficent Members":"Create Group"}
            </button>
          </div>
        </div>
        <div>
       
        </div>
      </div>
    </div>
  );}else{
    return (<Error />)
  }
};

