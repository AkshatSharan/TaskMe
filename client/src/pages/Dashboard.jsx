import { useState } from "react"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import Navigation from "../components/Navigation"  // Import the new Navigation component

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("all")

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

    return (
        <div className="min-h-screen bg-blue-300 text-white">
            <main className="md:ml-56">
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