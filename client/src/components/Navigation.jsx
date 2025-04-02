import React, { useState } from "react"
import { Menu, User, Home, List, Plus, X } from "lucide-react"
import { NavLink } from "react-router-dom"

const Navigation = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const colorMap = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        red: "bg-red-500",
        purple: "bg-purple-500",
    };

    const taskGroups = [
        { id: 1, name: "Design Team", color: "blue" },
        { id: 2, name: "Development", color: "green" },
        { id: 3, name: "QA Team", color: "red" },
        { id: 4, name: "Marketing", color: "purple" }
    ]

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handleGroupClick = (groupId) => {
        console.log(`Navigating to group ${groupId}`)
    }

    const handleAddGroup = () => {
        console.log("Open create group modal")
    }

    return (
        <>
            <aside
                className={`fixed top-0 left-0 h-full w-56 bg-blue-200 transform transition-transform duration-300 ease-in-out z-30 px-3 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="p-4 flex justify-middle items-center">
                    {sidebarOpen && (
                        <button onClick={toggleSidebar} className="md:hidden">
                            <X className="h-6 w-6 mr-4" />
                        </button>
                    )}
                    <h2 className="text-xl font-bold sm:mt-2">TaskMe</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-5">
                        <li>
                            <NavLink to='/' className="flex items-center space-x-2 text-white cursor-pointer hover:opacity-80">
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </NavLink>
                        </li>

                        <li>
                            <div
                                className="flex items-center justify-between text-white cursor-pointer hover:opacity-80"
                            >
                                <div className="flex items-center space-x-2">
                                    <NavLink to='/task-groups' className="flex items-center space-x-2 text-white cursor-pointer hover:opacity-80">
                                        <List className="h-5 w-5" />
                                        <span>Task Groups</span>
                                    </NavLink>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleAddGroup()
                                        }}
                                        className="hover:bg-blue-100 rounded-full p-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <ul className="mt-4 space-y-3 pl-6">
                                {taskGroups.map((group) => (
                                    <li
                                        key={group.id}
                                        className="flex items-center space-x-2 text-text-gray cursor-pointer hover:text-white"
                                        onClick={() => handleGroupClick(group.id)}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${colorMap[group.color]}`}
                                        />
                                        <span>{group.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </aside>

            <header className="bg-blue-200 p-4 flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="mr-4 md:hidden">
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <h2 className="text-xl font-bold md:hidden">TaskMe</h2>
                </div>
                <button className="rounded-full bg-blue-100 p-1">
                    <User className="h-6 w-6" />
                </button>
            </header>
        </>
    )
}

export default Navigation