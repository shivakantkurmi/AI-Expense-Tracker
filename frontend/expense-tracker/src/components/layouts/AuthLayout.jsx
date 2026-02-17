import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-violet-800 flex flex-col items-center px-4 py-10">

      <div className="w-full text-center mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400 drop-shadow-xl">
          Expense Tracker
        </h1>
        <p className="text-md text-white mt-2">
          Welcome to Expense Tracker! Manage your finances securely and in style.
        </p>
        <div className="h-1 bg-gradient-to-r from-cyan-400 to-pink-500 w-24 mx-auto mt-4 rounded-full" />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-gray-900">
        {children}
      </div>

    </div>
  );
};

export default AuthLayout;
