import { useState } from "react"
import { Menu, User, Home, List, Calendar, Settings, CheckCircle, Clock, AlertCircle, Plus, ChevronDown, ChevronRight, X } from "lucide-react"
import { NavLink } from "react-router-dom"

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("all")

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
    const tasks = [
        {
            id: 1,
            name: "Website Redesign",
            priority: "high",
            group: "Design Team",
            status: "progress",
        },
        {
            id: 2,
            name: "API Integration",
            priority: "medium",
            group: "Development",
            status: "completed",
        },
        {
            id: 3,
            name: "User Testing",
            priority: "low",
            group: "QA Team",
            status: "pending",
        },
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
        <div className="min-h-screen bg-blue-300 text-white">
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
                                    <List className="h-5 w-5" />
                                    <span>Task Groups</span>
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

            <main className={`transition-all duration-300 ${sidebarOpen ? "md:ml-56" : "sm:pl-0 md:ml-56"}`}>
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

                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="stat-card col-span-2">
                            <span className="text-text-gray text-sm">Completed</span>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-2xl font-bold">16</span>
                                <CheckCircle className="h-5 w-5 text-status-completed" color="green" />
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="text-text-gray text-sm">Pending</span>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-2xl font-bold">3</span>
                                <AlertCircle className="h-5 w-5 text-status-pending" color="red" />
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="text-text-gray text-sm">In Progress</span>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-2xl font-bold">5</span>
                                <Clock className="h-5 w-5 text-status-progress animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="p-2 flex space-x-2 mb-2 overflow-x-auto">
                        <button
                            className={`tab-button ${activeTab === "all" ? "bg-black" : "text-text-gray"}`}
                            onClick={() => setActiveTab("all")}
                        >
                            All Tasks
                        </button>
                        <button
                            className={`tab-button ${activeTab === "priority" ? "bg-black" : "text-text-gray"}`}
                            onClick={() => setActiveTab("priority")}
                        >
                            Priority
                        </button>
                    </div>

                    <div className="w-full overflow-x-auto rounded-lg">
                        <table className="w-full bg-blue-200 rounded-lg min-w-[600px]">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-text-gray text-xs sm:text-sm font-medium p-2 text-left">Task</th>
                                    <th className="text-text-gray text-xs sm:text-sm font-medium p-2 text-left">Priority</th>
                                    <th className="text-text-gray text-xs sm:text-sm font-medium p-2 text-left">Group</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="text-xs sm:text-sm border-b border-b-accent-stroke last:border-b-0 hover:bg-blue-100 transition-colors"
                                    >
                                        <td className="p-2 font-medium max-sm:max-w-[80px]">{task.name}</td>
                                        <td className="p-2">
                                            <span className={`priority-badge priority-${task.priority} text-xs sm:text-sm`}>
                                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-3 text-text-gray truncate max-w-[120px]">{task.group}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard