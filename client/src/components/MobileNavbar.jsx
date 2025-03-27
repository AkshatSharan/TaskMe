import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";

const MobileNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full bg-blue-200 shadow-md px-4 py-3 flex items-center justify-between">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1 className="text-xl font-bold">TaskMe</h1>

            <button className="p-2">
                <User size={24} />
            </button>

            {isOpen && (
                <div className="absolute top-14 left-0 w-full bg-blue-200 shadow-md flex flex-col items-start p-4 pb-0">
                    <a className="mobile-nav-list-item">Dashboard</a>
                    <a className="mobile-nav-list-item">Groups</a>
                </div>
            )}
        </nav>
    );
};

export default MobileNavbar;
