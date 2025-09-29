import { useState } from "react";
import { getAdminAccess, getMessages, getOpenedChatDetails} from "../services/apiService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminError } from "../Pages/AdminError";

export const AllMessages = () => {

  const [allMsg,setAllMsg] = useState([]);
  const[chatNameData,setChatNameData] = useState({});
  const[isAdmin,setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const getAllMsg = async() => {
    try {
        const res = await getMessages();
        if(res.status===201){
          setAllMsg(res.data);
        }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllMsg();
  },[])

 const getMsgChatLink = async () => {
  if (allMsg.length === 0) {
    return;
  }
  try {
    // ✅ Step 1: Extract all unique chat IDs
    const uniqueChatIds = [...new Set(allMsg.map((msg) => msg.chartlinked))];

    console.log("🔍 Unique chat IDs found:", uniqueChatIds.length, uniqueChatIds);

    // ✅ Step 2: Fetch chat details only once per chat ID
    const chatDetails = await Promise.all(
      uniqueChatIds.map(async (chatId) => {
        console.log("📡 Fetching chat details for:", chatId);
        const result = await getOpenedChatDetails(chatId);
        return {
          chatId,
          chatName: result.data[0].name,
          isGroup: result.data[0].groupchat,
        };
      })
    );

    console.log("✅ Total chat details fetched:", chatDetails.length);

    // ✅ Step 3: Convert array → lookup object (chatId → details)
    const chatLookup = {};
    chatDetails.forEach((chat) => {
      chatLookup[chat.chatId] = {
        chatName: chat.chatName,
        isGroup: chat.isGroup,
      };
    });

    // ✅ Step 4: Map messages to chat details (using chartlinked, not _id)
    const myRes = {};
    allMsg.forEach((msg) => {
      myRes[msg._id] = {
        chatName: chatLookup[msg.chartlinked]?.chatName || "Unknown",
        isGroup: chatLookup[msg.chartlinked]?.isGroup ?? false,
      };
    });

    setChatNameData(myRes);
  } catch (error) {
    console.log(error);
  }
};


  useEffect(()=>{
    getMsgChatLink();
  },[allMsg])

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

  if(isAdmin){
  return (
    

    <div className="p-4 text-white bg-[#0f172a] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">All Messages</h2>

      <div className="overflow-x-auto bg-[#1e293b] rounded-xl shadow-lg">
        <table className="min-w-[1200px] w-full text-sm text-left">
          <thead className="bg-[#334155] text-gray-200 uppercase">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Attachment</th>
              <th className="px-6 py-3">Content</th>
              <th className="px-6 py-3">Sent By</th>
              <th className="px-6 py-3">Chat</th>
              <th className="px-6 py-3">Group Chat</th>
              <th className="px-6 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {allMsg.map((curr) =>
            {
              const checkCloudinaryResourceType = (url, type) => {
                  try {
                    const urlObj = new URL(url);
                    const pathParts = urlObj.pathname.split('/');

                    // Typical Cloudinary structure: /<cloud_name>/<resource_type>/...
                    const resourceType = pathParts[2];

                    return resourceType === type;
                  } catch (error) {
                    console.error('Invalid URL:', error);
                    return false;
                  }
                }
              return (
              <tr
                key={curr._id}
                className="border-b border-[#475569] hover:bg-[#334155]"
              >
                <td className="px-6 py-4">{curr._id}</td>
                <td className="px-6 py-4">

                  {
                    curr.attachments.length===0 && <p>--</p>
                  }
                   {
                curr.attachments.length!==0 && (checkCloudinaryResourceType(curr.attachments[0].url,'image')?<img 
                          src={curr.attachments[0].url}
                          alt="Sample image"
                          className="w-full max-w-sm rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                                                          />:(checkCloudinaryResourceType(curr.attachments[0].url,'video')?<div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
                                    <video 
                                      controls 
                                      className="w-full h-auto rounded-lg"
                                      poster="#"
                                    >
                                      <source src={curr.attachments[0].url} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                    </div>:<a
                                    href={curr.attachments[0].url}
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                  >
                                    📄 View File (PDF,DOCX)
                                  </a>
                                  )
                  )
            }
                </td>
                <td className="px-6 py-4 max-w-xs break-words">{curr.content}</td>
                <td className="px-6 py-4">{curr.sender}</td>
                <td className="px-6 py-4">{chatNameData[curr._id]?chatNameData[curr._id].chatName:"Processing....."}</td>
                <td className="px-6 py-4">
                  {chatNameData[curr._id]?chatNameData[curr._id].isGroup.toString():"Processing....."}
                </td>
                <td className="px-6 py-4">{curr.date}</td>
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
  );}else{
    return <AdminError />
  }
};
