import React, { createContext, useState, useEffect } from "react";
import cookieManager from "../utils/cookieManager";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = cookieManager.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); 
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    cookieManager.set("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser(null);
    cookieManager.delete("user");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
