import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-800">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex items-center px-4">
        <Navbar activeMenu={activeMenu} />
      </header>
      {user && (
        <div className="flex flex-1 pt-16">
          <aside className="w-64 max-[1080px]:hidden  text-white pr-4 py-4 pl-0 fixed top-12 left-0 h-screen z-40 shadow-md rounded-lg">
            <SideMenu activeMenu={activeMenu} />
          </aside>
          <main className="grow max-[1080px]:ml-0 ml-64 overflow-y-auto px-5 py-4 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-800">
            {children}
          </main>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;