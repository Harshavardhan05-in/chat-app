import { useState } from 'react';
import { addNewPersonalChat, getLoginData, handleReceivedReq, handleUpdateRequest } from '../services/apiService';
import { useEffect } from 'react';
import { Error } from "./Error";



export const NotificationPage = () => {
  const[allRequests,setAllRequests] = useState([]);

  const[loginData,setLoginData] = useState({});

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


  const handleMyRequest = async() => {
    try {
        const res = await handleReceivedReq(loginData._id);
        if(res.status===201){
          setAllRequests(res.data);
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(()=>{
    if(loginData._id!==undefined){
        handleMyRequest();
    }
  },[loginData])

  const handleAddRequest = async(id,action) => {
    try {
      if(action==="Accept"){
          const modifiedData = {
            status:"accepted"
          }
          const res = await handleUpdateRequest(id,modifiedData);
          if(res.status===200){

            const updatedList = allRequests.map((curr)=>{
              if(curr._id===res.data._id){
                 return {...curr,status:"accepted"};
              }else{
                return curr;
              }
            })

            setAllRequests(updatedList);

            const myPersonalChat = {
              name:res.data.sender.username,
              groupchat:false,
              creator:res.data.sender._id,
              members:[res.data.receiver._id,res.data.sender._id]
            }
            const chatRes = await addNewPersonalChat(myPersonalChat);
          }
      }else if(action==="Reject"){
        const modifiedData = {
          status:"rejected"
        }
        const res = await handleUpdateRequest(id,modifiedData);
        const updatedList = allRequests.map((curr)=>{
              if(curr._id===res.data._id){
                return {...curr,status:"rejected"};
              }else{
                return curr;
              }
        })

        setAllRequests(updatedList);

      }
    } catch (error) {
      console.log(error);
    }
  }

  let count = 1;

  // if(isValidated){
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-8 sm:p-12 w-full mx-auto">
      <h1 className="text-4xl font-extrabold mb-12 text-center tracking-wide select-none">
        User Notifications
      </h1>

      <div className="space-y-6">
        {allRequests.length===0?<h1 className="text-2xl font-bold mb-12 text-center tracking-wide select-none">
        No Requests.....
      </h1>:allRequests.map(({ _id,status, sender }) => (
          <div
            key={_id}
            className="bg-gray-800 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 relative hover:shadow-xl transition-shadow duration-300"
          >
            <div className="max-w-full sm:max-w-xs mb-4 sm:mb-0">
              <h2 className="text-xl font-semibold truncate">{sender.username}</h2>
            </div>

            <div className="flex space-x-5">
              {
                status==="pending" && <div> <button
                        onClick={()=>handleAddRequest(_id,"Accept")}
                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-pink-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={()=>handleAddRequest(_id,"Reject")}
                        className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-pink-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                      >
                        Reject
                      </button></div>
              }
              {
                  status==="accepted" && <button
                disabled={true}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-pink-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Accepted
              </button>
              }
              {
                  status==="rejected" && <button
                  disabled={true}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-pink-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Rejected
              </button>
              }
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );}
//   else{
//     return (<Error />)
//   }
// }
