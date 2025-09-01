import axios from "axios";

export const api = axios.create({
    baseURL:"https://chat-app-rg6r.onrender.com",
})

export const postRegisterDetails = (data) => {
    return api.post("/postregister",data,{
        withCredentials:true,
    });
}

export const postLoginData = (data) => {
    return api.post("/postlogin",data,{
        withCredentials:true,
    });
}

export const getLoginData = () => {
    console.log("INSIDE API SERVICES:LOGIN DATA FUN");
    return api.get("/getlogin",{
        withCredentials:true,
    })
}

// export const getAllUsers = ()=>{
//     return api.get("/getallusers",{
//         withCredentials:true,
//     })
// }

export const userLogout = () => {
    return api.get("/logout",{
        withCredentials:true
    })
}

export const deleteUser = (id)=>{
    return api.delete(`/delete/${id}`)
}

export const getAllUserDetails = () => {
    return api.get("/getall",{
        withCredentials:true
    });
}

export const addGroupdata = (data) => {
    return api.post("/addgroup",data,{
        withCredentials:true,
    })
}

export const addNewRequest = (data) => {
    return api.post("/addreq",data,{
        withCredentials:true
    })
}

export const getMyCharts = (id) => {
    return api.get(`/mycharts/${id}`,{
        withCredentials:true
    })
}

export const getMyAdminChats = (id) => {
    return api.get(`/modifychats/${id}`,{
        withCredentials:true
    })
}

export const updateGroupMembers = (id,data) => {
    return api.put(`/update/${id}`,data,{
        withCredentials:true,
        new:true
    });
}

export const deleteMyGroup = (id) => {
    return api.delete(`/deletegroup/${id}`)
}

export const exitFromGroup = (id,data) => {
    return api.put(`/exit/${id}`,data,{
        new:true
    });
}

export const handleReceivedReq = (id) => {
    return api.get(`/recreq/${id}`);
}

export const handleUpdateRequest = (id,data) => {
    return api.put(`/updatereq/${id}`,data)

}

export const addNewPersonalChat = (data) => {
    return api.post("/addpersonalchat",data,{
        withCredentials:true
    })
}

export const getOpenedChatDetails = (id) => {
    return api.get(`/getchat/${id}`,{
        withCredentials:true
    })
}

export const addNewMessages = (data) => {
    return api.post("/addmsg",data);
}

export const getMyFrndCount = (id) => {
    return api.get(`/myfrndcnt/${id}`,{
        withCredentials:true
    })
}

export const getChatCount = (id) => {
    return api.get(`/chatcount/${id}`,{
        withCredentials:true
    })
}

export const getAllCharts = () => {
    return api.get("/allchats",{
        withCredentials:true
    })
}

export const getAllMessages = (id) => {
    return api.get(`/chatmsg/${id}`,{
        withCredentials:true
    })
}

export const getMessages = () => {
    return api.get("/mymsg",{
        withCredentials:true
    });
}

export const getAllChatCount = () => {
    return api.get("/allchatcount");
}

export const getUserCount = () => {
    return api.get("/usercount");
}

export const getMsgCount = () => {
    return api.get("/msgcount",{
        withCredentials:true
    })
}

export const getGroupChatCount = () => {
    return api.get("/groupchatcount",{
        withCredentials:true
    })
}

export const getPrivateChatCount = () => {
    return api.get("/privatechatcount",{
        withCredentials:true
    })
}

export const checkAdmiLogin = (data) => {
    return api.post("/adminlogin",data,{
        withCredentials:true
    })
}

export const getAdminAccess = () => {
    return api.get("/adminaccess",{
        withCredentials:true
    });
}

export const getAllMessageDetails = (id) => {
    return api.get(`/chatallmsg/${id}`,{
        withCredentials:true
    })
}

export const logoutAdmin = () => {
    return api.get("/logoutadmin",{
        withCredentials:true
    })
}

export const getNonReqUsers = (id) => {
    console.log("NON REQ USER CALL");
    return api.get(`/checkreq/${id}`);
}

export const deleteRequest = (id1,id2) => {
    return api.delete(`/deletereq/${id1}/${id2}`)
}

export const deleteMessages = (id) => {
    return api.delete(`/deletemsg/${id}`)
}

export const removeAllLinkedReq = (id) => {
    return api.delete(`/removereq/${id}`)
}
