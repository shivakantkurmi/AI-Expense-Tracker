import React from "react";
import { getInitials } from "../../utils/helper";

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`${width || "w-10 sm:w-12"} ${height || "h-10 sm:h-12"} 
      flex items-center justify-center rounded-full 
      bg-gradient-to-br from-blue-300 to-purple-700 text-white 
      text-sm sm:text-base font-bold
      ${style || ""}`}
      style={style}
    >
      {getInitials(fullName) || ""}
    </div>
  );
};

export default CharAvatar;
