import {  useEffect, useState } from "react";
import { FaUserShield } from "react-icons/fa";
import {toast} from "react-hot-toast";
import { checkAdmiLogin, getAdminAccess } from "../services/apiService";
import {useNavigate} from "react-router-dom";




export const AdminLogin = () => {
  const [secretKey, setSecretKey] = useState("");

  const naviagte = useNavigate();

  const handleFormSubmit = async(e) => {
    e.preventDefault();

    if (secretKey.trim() === "") {
      toast.error("Please Enter Secret Key")
      return;
    }
    try {
        const res = await checkAdmiLogin({secretKey});
        if(res.status===201){
          naviagte("/admin/dashboard")
        }
    } catch (error) {
         console.log("error:",error)
         if(error.status==404){
            toast.error("Invalid Secret Key");
         }else{
            toast.error("Requested Timeout Please Try After some Time");
         }
    }
    
  };


  

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">
      <div className="bg-[#1e293b] p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <FaUserShield className="text-5xl text-blue-400" />
        </div>
        <h2 className="text-center text-2xl font-semibold mb-4">Admin Login</h2>
          <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="secretKey" className="block mb-2 text-sm font-medium">
            Enter Secret Key
          </label>
          <input
            type="password"
            id="secretKey"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full p-3 bg-[#334155] rounded-md border border-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded-md font-semibold"
        >
          Login
        </button>
          </form>
      </div>
    </div>
  );

};
