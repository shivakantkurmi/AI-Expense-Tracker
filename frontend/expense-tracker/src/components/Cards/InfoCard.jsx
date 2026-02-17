import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 bg-gradient-to-br from-white to-gray-50">
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 rounded-full shadow-md">
        {icon}
      </div>
      <div className="flex-1">
        <h6 className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 font-medium uppercase tracking-wide">
          {label}
        </h6>
        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-1">
          ₹{value}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
