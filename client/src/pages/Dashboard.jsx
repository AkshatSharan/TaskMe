import { useState, useRef, useEffect } from "react";
import { CheckCircle, AlertCircle, Clock, ChevronDown, Filter } from "lucide-react";
import { getTasks } from "../utils/taskAPI";
import Loading from "../components/Loading";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
    const dropdownRef = useRef(null);
    const [thisUser, setThisUser] = useState();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                setThisUser(storedUser);
                const userId = storedUser ? storedUser.id : null;
                setLoading(true);
                const res = await getTasks(userId)
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
        return task.priority.toLowerCase() === priorityFilter.toLowerCase();
    });


    const pendingCount = tasks.filter(task => task.status === "Pending").length;
    const progressCount = tasks.filter(task => task.status === "In Progress").length;

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-blue-300 text-white">
            <main className="md:ml-56 sm:p-5">
                <h1 className="text-4xl p-9 font-bold pb-0">Hey {thisUser.name}!</h1>
                <div className="p-9">
                    <div className="grid grid-cols-2 gap-4 mb-6">
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

                    <h1 className="text-3xl p-9 pl-0 pb-7 font-bold">Your Tasks</h1>
                    <div className="p-2 flex space-x-2 mb-2">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className={`tab-button flex items-center ${isPriorityDropdownOpen ? 'bg-black text-white' : 'text-text-gray'}`}
                                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                            >
                                <Filter className="w-4 h-4 mr-1" />
                                Filter Priority
                                <ChevronDown className="w-4 h-4 ml-1" />
                            </button>

                            {isPriorityDropdownOpen && (
                                <div className="absolute mt-2 bg-gray-800 rounded-md shadow-md text-sm z-11 w-full overflow-hidden">
                                    {["High", "Medium", "Low", null].map(p => (
                                        <button
                                            key={p ?? "all"}
                                            className={`block w-full z-10 text-center px-4 py-2 hover:bg-gray-700 ${priorityFilter === p ? "bg-gray-700" : ""}`}
                                            onClick={() => {
                                                setPriorityFilter(p);
                                                setIsPriorityDropdownOpen(false);
                                            }}
                                        >
                                            {p ? `${p.charAt(0).toUpperCase() + p.slice(1)}` : "All"}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full rounded-lg relative" style={{ zIndex: 10 }}>
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full bg-blue-200 rounded-lg min-w-[600px]">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-text-gray text-xs sm:text-sm font-medium p-5 text-left">Task</th>
                                        <th className="text-text-gray text-xs sm:text-sm font-medium p-5 text-left">Priority</th>
                                        <th className="text-text-gray text-xs sm:text-sm font-medium p-5 text-left">Group</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map((task) => (
                                            <tr
                                                key={task._id}
                                                className="text-xs sm:text-sm border-b border-b-accent-stroke last:border-b-0 hover:bg-blue-100 transition-colors"
                                            >
                                                <td className="p-4 font-medium max-sm:max-w-[80px]">{task.title}</td>
                                                <td className="p-4">
                                                    <span className={`priority-badge priority-${task.priority} text-xs sm:text-sm`}>
                                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-text-gray truncate max-w-[120px]">{task.group?.name}</td>
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