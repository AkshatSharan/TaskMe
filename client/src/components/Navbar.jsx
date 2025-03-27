import React, { useState } from "react"
import { Menu, Home, List, Calendar, Settings, X } from "lucide-react"

export interface NavItem {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    href?: string;
}

interface ResponsiveNavbarProps {
    navItems: NavItem[];
    brandName?: string;
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
    navItems,
    brandName = "TaskMe"
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <>
            {/* Mobile Header */}
            <header className="bg-blue-200 p-4 flex justify-between items-center sticky top-0 z-20 md:hidden">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="mr-4">
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <h2 className="text-xl font-bold">{brandName}</h2>
                </div>
            </header>

            {/* Sidebar for all screens */}
            <aside
                className={`fixed top-0 left-0 h-full w-56 bg-blue-200 transform transition-transform duration-300 ease-in-out z-30 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
            >
                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold mt-2 hidden md:block">{brandName}</h2>
                    {sidebarOpen && (
                        <button onClick={toggleSidebar} className="md:hidden">
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>
                <nav className="p-4">
                    <ul className="space-y-4">
                        {navItems.map((item, index) => (
                            <li
                                key={index}
                                className={`flex items-center space-x-2 cursor-pointer 
                  ${item.active ? "text-white" : "text-text-gray"}`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default ResponsiveNavbar