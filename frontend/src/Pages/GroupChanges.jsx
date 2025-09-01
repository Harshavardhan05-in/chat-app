import { useEffect, useState } from 'react';
import { deleteMessages, deleteMyGroup, exitFromGroup, getAllUserDetails, getLoginData, getMyAdminChats, updateGroupMembers } from '../services/apiService';
import { RiAdminFill } from "react-icons/ri";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import {toast} from "react-hot-toast";
import { MdGroups2 } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { Error } from "./Error";


export const GroupPage = () => {
  // All groups Created BY Me
  const [myGroups, setMyGroups] = useState([]);
  const[selectAddUsers,setSelectAddUsers] = useState(false);
  // Selected Group
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const[isValidated,setValidate] = useState(false);
  const [loading, setLoading] = useState(true);

  const[allUsers,setAllUsers] = useState([]);
  const[addMembersList,setAddMembersList] = useState([]);

  const[memToBeAdded,setMemToBeAdded] = useState([]);

  

  const fetchLoginData = async () => {
    try {
      const res = await getLoginData();
      if (res.status === 200) {
        setLoginData(res.data);;
        setValidate(true)
      }
    } catch (error) {
      console.error('Failed to fetch login data:', error);
      setValidate(false);
    }
  };

  const getAllUsersDetails = async() => {
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
    getAllUsersDetails();
  },[])


  const fetchAdminGroups = async (userId) => {
    try {
      const res = await getMyAdminChats(userId);
      if (res.status === 200) {
        setMyGroups(res.data);
        setSelectedGroup(res.data[0] || null);
      }
    } catch (error) {
      console.error('Failed to fetch admin groups:', error);
    }
  };

  useEffect(() => {
    fetchLoginData();
  }, []);

  useEffect(() => {
    if (loginData?._id) {
      fetchAdminGroups(loginData._id);
      setLoading(false);
    }
  }, [loginData]);


  const updateMembersList = async(id,selectedList) => {
    try {
      const res = await updateGroupMembers(id,selectedList);
      if(res.status===200){
        toast.success("User Removed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemoveUser = (userId,id) => {
    if (!selectedGroup) return;
    if(selectedGroup.members.length<=3){
      toast.error("Unable to Remove User");
      return;
    }
    const updatedMembers = selectedGroup.members.filter((member) => member._id !== userId);
    setSelectedGroup({ ...selectedGroup, members: updatedMembers });
    updateMembersList(id,updatedMembers);
  };



  const handleDeleteGroup = async(id) => {
    try {
      const res = await deleteMyGroup(id);
      const res1 = await deleteMessages(id);
      
      if(res.status===200 && res1.status===201){
        toast.success("Group Deleted!");
        const updatedList = myGroups.filter((currgroup)=>{
          return currgroup._id!==id;
        })
        setMyGroups(updatedList);
        setSelectedGroup([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUser = () => {
    setSelectAddUsers(true);
    if(allUsers.length===0){
      toast.error("NO Users");
      return ;
    }

    const groupUsers = new Set(selectedGroup.members.map((curr)=>curr._id))
    const validUsers = allUsers.filter((curr)=>{
      return !groupUsers.has(curr._id);
    })
    setAddMembersList(validUsers);

  };

  const handleNewMember = (user) => {
    setMemToBeAdded([...memToBeAdded,user]);
    const updatedList = addMembersList.filter((curr)=>{
      return curr._id!==user._id;
    })
    setAddMembersList(updatedList);
  }

  const updateNewMembersList = async(id,selectedMem) => {
    try {
      const res = await updateGroupMembers(id,selectedMem);
      if(res.status===200){
        setSelectedGroup({...selectedGroup,members:selectedMem});
        toast.success("Members Added Sucessfully");
        setMemToBeAdded([]);
        setSelectAddUsers(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddNewUsersList = () => {
    const mergedMembers = [...memToBeAdded,...selectedGroup.members];
    updateNewMembersList(selectedGroup._id,mergedMembers);

  }

  const handleExitUser = async(chat) => {
      try {
        if(chat.members.length===3){
          toast.error("To Exit From the group, The group must have atleast 4 members")
        }else{
          const newGroupchat = chat.members.filter((curr)=>{
            return curr._id!==loginData._id;
          })
          const newUpdatedGroupChat = newGroupchat.map((curr)=>{
            return curr._id;
          })
          const newData = {
            creator:chat.members[1]._id,
            members:newUpdatedGroupChat,
          }
          const res = await exitFromGroup(chat._id,newData);

          if(res.status===200){
            const updatedList = myGroups.filter((curr)=>{
              return curr._id!==res.data._id;
            })
            setMyGroups(updatedList);
            if(updatedList.length===0){
                setSelectedGroup([]);
            }else{
                setSelectedGroup(updatedList[0]);
            }
            toast.success("Sucessfully Exited From the GROUP");
          }
        }
      } catch (error) {
        console.log(error);
      }
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if(isValidated){
  return (
    <div className="flex h-screen bg-gray-900 text-white max-h-[800px] overflow-y-auto pb-3">
      {/* Sidebar (3/8) */}
      {
        selectAddUsers===false?<div className="basis-[37.5%] border-r border-gray-800 p-4 overflow-y-auto">
                          <h2 className="text-xl font-bold mb-4">Your Groups</h2>
                          <ul className="space-y-3">
                            {myGroups.length===0?<h1> NO GROUPS FOUND</h1>:myGroups.map((group) => (
                              <li
                                key={group._id}
                                onClick={() => setSelectedGroup(group)}
                                className={`p-3 rounded cursor-pointer flex items-center space-x-3 ${
                                  selectedGroup?._id === group._id ? 'bg-gray-700' : 'hover:bg-gray-800'
                                }`}
                              >
                            
                                <MdGroups2 className="w-10 h-10 rounded-full object-cover" />
                                <span>{group.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
      :
                        <div className="basis-[37.5%] border-r border-gray-800 p-4 overflow-y-auto">
                          <h2 className="text-xl font-bold mb-4">Members List</h2>
                          { addMembersList.length===0?<h1>NO MEMBERS FOUND</h1> :addMembersList.map((user) => (
                              <li
                                key={user._id}
                                className="flex justify-between items-center bg-gray-800 p-3 rounded"
                              >
                                <span>{user.username}</span>
                                 <button
                                  className="text-red-500 hover:text-red-400 text-xl"
                                  onClick={()=>handleNewMember(user)}
                                >
                                  
                              <IoMdPersonAdd />
                                </button>
                      
                              </li>
                             ))
                          }
                          {
                            memToBeAdded.length!==0 && <div className="basis-[37.5%] border-r border-gray-800 p-4 overflow-y-auto">
                          <h2 className="text-xl font-bold mb-4 ">Selected Members</h2>
                          { memToBeAdded.map((user) => (
                              <li
                                key={user._id}
                                className="flex justify-between items-center bg-gray-800 p-3 rounded"
                              >
                                <span>{user.username}</span>
                      
                              </li>
                             ))
                          }
                          <button
                          onClick={handleAddNewUsersList}
                          className="bg-green-600 hover:bg-blue-300 px-4 py-2 rounded mt-3"
                        >
                          Add Into Group
                        </button>
                          </div>
                          }
                          
                        </div>
      }
      

      {/* Main Panel (5/8) */}
      <div className="basis-[62.5%] p-6 flex flex-col justify-between">
        {!selectedGroup ? (
          <div className="text-lg text-gray-300">Select a group to manage members</div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-4">{selectedGroup.name} - Settings</h2>
              <ul className="space-y-3 mb-6">
                {selectedGroup.members?.length > 0 ? (
                  selectedGroup.members.map((user) => (
                    <li
                      key={user._id}
                      className="flex justify-between items-center bg-gray-800 p-3 rounded"
                    >
                      <span>{user.username}</span>
                      {
                        user._id!==loginData._id && <button
                        onClick={() => handleRemoveUser(user._id,selectedGroup._id)}
                        className="text-red-500 hover:text-red-400 text-xl"
                      >
                        <IoMdRemoveCircleOutline />
                      </button>
                      }
                      {
                        user._id===loginData._id && <button
                        className="text-red-500 hover:text-red-400 text-xl"
                        disabled={true}
                      >
                        <RiAdminFill />
                      </button>

                      }
                      
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No members in this group</li>
                )}
              </ul>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddUser}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
              >
                Add Users
              </button>

              <button
                onClick={()=>handleExitUser(selectedGroup)}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
              >
                Exit Group
              </button>


              <button
                onClick={()=>handleDeleteGroup(selectedGroup._id)}
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
              >
                Delete Group
              </button>
            </div>
          </>
        )}
      <div className="h-4 block">&nbsp;</div>

      </div>
    </div>
  );}
  else{
    return (<Error />)
  }
};