import React, { useContext, useEffect } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu = "" }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white shadow-lg flex flex-col border-r border-gray-200">
      <div className="flex flex-col items-center justify-center gap-3 py-6 border-b border-gray-100 px-4">
        <CharAvatar
          fullName={user?.user?.fullName || "Guest"}
          width="w-20"
          height="h-20"
          style={{ fontSize: "1.25rem", color: "#333" }}
        />
        <h5 className="text-gray-800 font-semibold text-lg text-center">
          {user?.user?.fullName || "Guest"}
        </h5>
      </div>

      <div className="flex flex-col mt-4 space-y-1 px-2">
        {SIDE_MENU_DATA.map((item, index) => {
          const isActive = activeMenu === item.label;
          return (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium 
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <item.icon className={`text-lg ${isActive ? "text-white" : "text-gray-600"}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
