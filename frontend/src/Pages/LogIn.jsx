import { useState } from "react";
import { postLoginData } from "../services/apiService";
import {toast} from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";


export const LogIn = () => {

  const navigate = useNavigate();

    const[logInData,setLogInData] = useState({
        email:"",
        password:""
    })

    const handleInputChange = (e) => {
        const{name,value} = e.target;

        setLogInData((prev)=>({...prev,[name]:value}))
    }

    const postLoginDetials = async() => {
        try {
          const res = await postLoginData(logInData);
          if(res.status===200){
            toast.success("LogIn Sucessfull");
            navigate("/");
          }
        } catch (error) {
          if(error.status===404){
            toast.error("Invalid Credentials");
            setLogInData({
              email:"",
              password:""
            })
          }else{
            toast.error("Request Timed out Please Try Again after some time");
            navigate("/login")
          }
        }
    }
    const handleFormSubmit = (e) => {
        e.preventDefault();
        postLoginDetials();
    }
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Sign in to your account
        </h2>
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={logInData.email}
              onChange={(e)=>handleInputChange(e)}
              autoComplete="off"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={logInData.password}
              onChange={(e)=>handleInputChange(e)}
              autoComplete="off"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                      >
                        Sign In
                      </button>
          
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
                  <NavLink to="/register" className="text-indigo-600 hover:underline">
            Sign up
          </NavLink>
          
        </p>
      </div>
    </div>
  );
}

