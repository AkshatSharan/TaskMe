import { useState, useRef, useEffect } from "react";
import { CheckCircle, AlertCircle, Clock, ChevronDown, Filter } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/tasks`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTasks(res.data);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredTasks = tasks.filter(task => {
        if (priorityFilter === null) return true;
        return task.priority === priorityFilter;
    });

    const completedCount = tasks.filter(task => task.status === "completed").length;
    const pendingCount = tasks.filter(task => task.status === "pending").length;
    const progressCount = tasks.filter(task => task.status === "progress").length;

    return (
        <div className="min-h-screen bg-blue-300 text-white">
            <main className="md:ml-56 sm:p-5">
                <div className="p-9">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="stat-card col-span-2">
                            <span className="text-text-gray text-sm">Completed</span>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-2xl font-bold">{completedCount}</span>
                                <CheckCircle className="h-5 w-5 text-status-completed" color="green" />
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="text-text-gray text-sm">Pending</span>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-2xl font-bold">{pendingCount}</span>
                                <AlertCircle className="h-5 w-5 text-status-pending" color="red" />
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="text-text-gray text-sm">In Progress</span>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-2xl font-bold">{progressCount}</span>
                                <Clock className="h-5 w-5 text-status-progress animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="p-2 flex space-x-2 mb-2">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className={`tab-button flex items-center ${dropdownOpen ? 'bg-black text-white' : 'text-text-gray'}`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <Filter className="w-4 h-4 mr-1" />
                                Filter Priority
                                <ChevronDown className="w-4 h-4 ml-1" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute left-0 mt-1 w-fit bg-white rounded-md shadow-xl z-50">
                                    <ul className="py-1 text-sm text-black">
                                        <li>
                                            <button
                                                className={`w-full text-left px-4 py-2 hover:bg-blue-100 ${priorityFilter === "high" ? "bg-blue-200 text-white" : ""}`}
                                                onClick={() => {
                                                    setPriorityFilter("high");
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                High Priority Only
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`w-full text-left px-4 py-2 hover:bg-blue-100 ${priorityFilter === "medium" ? "bg-blue-200" : ""}`}
                                                onClick={() => {
                                                    setPriorityFilter("medium");
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                Medium Priority Only
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`w-full text-left px-4 py-2 hover:bg-blue-100 ${priorityFilter === "low" ? "bg-blue-200" : ""}`}
                                                onClick={() => {
                                                    setPriorityFilter("low");
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                Low Priority Only
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`w-full text-left px-4 py-2 hover:bg-blue-100 ${priorityFilter === null ? "bg-blue-200" : ""}`}
                                                onClick={() => {
                                                    setPriorityFilter(null);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                Show All Priorities
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {priorityFilter !== null && (
                        <div className="bg-blue-400 text-white text-sm rounded-lg p-2 mb-2 flex justify-between items-center">
                            <span>
                                Showing only <strong>{priorityFilter}</strong> priority tasks
                            </span>
                            <button
                                onClick={() => setPriorityFilter(null)}
                                className="text-white hover:text-blue-100 ml-2 p-1 rounded-full hover:bg-blue-500"
                                title="Clear filter"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div className="w-full rounded-lg relative" style={{ zIndex: 10 }}>
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full bg-blue-200 rounded-lg min-w-[600px]">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-text-gray text-xs sm:text-sm font-medium p-2 text-center">Task</th>
                                        <th className="text-text-gray text-xs sm:text-sm font-medium p-2 text-center">Priority</th>
                                        <th className="text-text-gray text-xs sm:text-sm font-medium p-2 text-center">Group</th>
                                        <th className="text-text-gray text-xs sm:text-sm font-medium p-2 text-center">Date Added</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map((task) => (
                                            <tr
                                                key={task._id}
                                                className="text-xs sm:text-sm border-b border-b-accent-stroke last:border-b-0 hover:bg-blue-100 transition-colors"
                                            >
                                                <td className="p-4 font-medium max-sm:max-w-[80px]">{task.name}</td>
                                                <td className="p-4">
                                                    <span className={`priority-badge priority-${task.priority} text-xs sm:text-sm`}>
                                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-text-gray truncate max-w-[120px]">{task.group}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-center text-gray-500">
                                                No tasks match the selected filter
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;