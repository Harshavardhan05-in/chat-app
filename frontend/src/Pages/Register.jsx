import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { postRegisterDetails } from "../services/apiService";
import { NavLink, useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";


export const Register = () => {

  const navigate = useNavigate();

    const[registerDetails,setRegisterDetails] = useState({
        username:"",
        email:"",
        password:"",
        cpassword:"",
        profileimage:""
    })

    const[errorMessage,setErrorMessage] = useState({
      username:"",
      email:"",
      password:"",
    })

    const[imageLoading,setImageLoading] = useState(false);

    const[imageUrl,setImageURL] = useState(null);

    const handleInputChange = (e) => {
        const{name,value} = e.target;
        setRegisterDetails((prev)=>({...prev,[name]:value}))

        switch(name){
            case "username" : if(value.includes('-') || value.includes('@') || value.includes('$') || value.includes('&')){
                                  setErrorMessage((prev)=>({...prev,username:"Invalid Username"}))
                              }else{
                                  setErrorMessage((prev)=>({...prev,username:""}))
                              }
                              break;
            case "email" : if(value.includes(" ") || (value.includes('@')==false)){
                                  setErrorMessage((prev)=>({...prev,email:"Invalid Email"}))
                            }else{
                                  setErrorMessage((prev)=>({...prev,email:""}))
                              }
                            break;
            case "password" : if(value.includes(" ") || value.length<5){
                                setErrorMessage((prev)=>({...prev,password:"Invalid Password Please Dont Inlude Spaces && Password Must be minium of 5 characters"}))
                              }else{
                                  setErrorMessage((prev)=>({...prev,password:""}))
                              }
                              break;
        }

    }

    // Post Into DataBase;
    const handlePostRequest = async() => {
      try {
        const res  = await postRegisterDetails(registerDetails);
        if(res.status===201){
            toast.success(" Account Created Sucessfully ",{
              style:{
                background:'#1d4ed8',
                color:'#fff'
              }
            });
            navigate("/login");
        }
      } catch (error) {
        console.log("ERROR",error);
        if(error.status===401){
          toast.error(" Invalid Credentials",{
            style:{
              background:'#b91c1c',
              color:'#fff'
            }
          });
          setRegisterDetails((prev)=>({...prev,
            password:"",
            cpassword:""

          }))

        }else{
          toast.error(" Account Creation TimedOut",{
            style:{
              background:'#b91c1c',
              color:'#fff'
            }
          });
          navigate("/register");
        }
      }
      
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handlePostRequest();
    }

  const compressImage = async (file) => {
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Resize image
  canvas.width = 800;
  canvas.height = (image.height / image.width) * 800;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const compressedFile = new File([blob], file.name, { type: file.type });
      resolve(compressedFile);
    }, file.type, 0.7); // 70% quality
  });
};


    const hanldeProfileImage = async(e) => {
      const file = await compressImage(e.target.files[0]);

      setImageLoading(true);

      const formData = new FormData();
      formData.append("file",file);
      formData.append("upload_preset","my_preset");

      const res = await fetch("https://api.cloudinary.com/v1_1/dyc89dtkh/image/upload",{
        method:"POST",
        body:formData,
      })

     
      if(res.status==200){
        const data = await res.json();
        setRegisterDetails((prev)=>({...prev,profileimage:data.secure_url}))
        setImageURL(data.secure_url);


      }

    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
        <form  className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            {
                (imageUrl===null && imageLoading==false) && <div className="flex flex-col items-center mb-6">
          <label htmlFor="profileUpload" className="cursor-pointer">
            <CgProfile  className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 " />
          </label>
            <input
            id="profileUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e)=>hanldeProfileImage(e)}
          />
          <p className="text-mm text-gray-900 mt-3">Click to upload profile image</p>          
        </div>
            }
            {
                (imageUrl===null && imageLoading)  && <div className="flex flex-col items-center mb-6">
          <label htmlFor="profileUpload" className="cursor-pointer">
            <CgProfile  className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 " />
          </label>
            <input
            id="profileUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e)=>hanldeProfileImage(e)}
          />
          <p className="text-mm text-gray-900 mt-3">Loading.....</p>          
        </div>
            }
            {
                imageUrl!==null && <div className="flex flex-col items-center mb-6">
                  <img className="w-42 h-40 rounded-[10px] object-cover border-4 border-purple-500" src={imageUrl} />
          <p className="text-mm text-green-800 mt-3"> Image Uploaded</p>          
        </div>
            }
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={registerDetails.username}
              onChange={(e)=>handleInputChange(e)}
              autoComplete="off"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {
                errorMessage.username && <p className="text-red-500 text-sm mt-1"> {errorMessage.username}</p>
            }
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={registerDetails.email}
              onChange={(e)=>handleInputChange(e)}
              autoComplete="off"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {
                errorMessage.email && <p className="text-red-500 text-sm mt-1"> {errorMessage.email}</p>
            }
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
                value={registerDetails.password}
              onChange={(e)=>handleInputChange(e)}
              autoComplete="off"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {
                errorMessage.password && <p className="text-red-500 text-sm mt-1"> {errorMessage.password}</p>
            }
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="cpassword"
              value={registerDetails.cpassword}
              onChange={(e)=>handleInputChange(e)}
              required
              autoComplete="off"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            disabled={ (errorMessage.username=="" && errorMessage.email=="" && errorMessage.password=="")?false:true}
            className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white font-semibold py-2 rounded-lg shadow-md hover:from-purple-700 hover:to-red-600 transition duration-300"
          >
            Register
          </button>
          <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <NavLink to="/login" className="text-indigo-600 hover:underline" >
            Log In
          </NavLink>        
        </p>
        </form>
      </div>
    </div>
  );
};

