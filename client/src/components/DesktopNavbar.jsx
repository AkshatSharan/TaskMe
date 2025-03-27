import React from "react";
import { User } from "lucide-react";

const DesktopNavbar = () => {
  return (
    <nav className="h-screen w-54 bg-blue-200 shadow-md flex flex-col justify-between p-9 fixed left-0 top-0 items-center">
      <h1 className="text-3xl font-bold mb-8">TaskMe</h1>

      <div className="flex flex-col text-lg gap-8 h-full justify-center w-full">
        <a href="#" className="hover:text-gray-600 text-center px-4 py-2 rounded-full bg-blue-100 ">Dashboard</a>
        <a href="#" className="hover:text-gray-600 text-center px-4 py-2 rounded-full bg-blue-100 ">Tasks</a>
        <a href="#" className="hover:text-gray-600 text-center px-4 py-2 rounded-full bg-blue-100 ">Projects</a>
        <a href="#" className="hover:text-gray-600 text-center px-4 py-2 rounded-full bg-blue-100 ">Settings</a>
      </div>

      <button className="p-2 bg-black rounded-xl flex justify-center">
        <User size={28} />
      </button>
    </nav>
  );
};

export default DesktopNavbar;
