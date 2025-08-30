import { NavLink } from "react-router-dom";

export const AdminError = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full text-center animate-fade-in-up">
        <div className="text-6xl mb-4 text-red-500 animate-bounce">🚫</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Accessible</h1>
        <p className="text-gray-600 mb-6">
          You need Admin Prevalages To Access This Page
        </p>
        <NavLink
          to="/admin"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
        >
          Please Login as Admin To Continue
        </NavLink>
      </div>
    </div>
  );
};