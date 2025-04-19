import React, { useEffect, useState, useRef } from "react";
import {
    Trash2, Plus, Filter, ChevronDown, LogOut,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import GroupModals from "../components/GroupModals";
import { deleteTask, getGroupById, joinRequest, updateTask } from "../utils/taskAPI";
import Loading from "../components/Loading";

const GroupDetails = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [priorityFilter, setPriorityFilter] = useState(null);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] = useState(false);
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

    const [taskForm, setTaskForm] = useState({
        id: null,
        title: "",
        description: "",
        assignedTo: "",
        status: "Pending",
        priority: "medium",
    });

    const priorityDropdownRef = useRef(null);

    useEffect(() => {

        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser ? storedUser.id : null;
        const fetchGroupData = async () => {
            try {
                const res = await getGroupById(groupId);
                setGroup(res.data);
                if (res.data.tasks) setTasks(res.data.tasks);
            } catch (err) {
                console.error("Failed to fetch group data", err);
                navigate("/dashboard");
            }
        };

        setGroup(null);
        setTasks([]);
        fetchGroupData();
    }, [groupId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target)) {
                setIsPriorityDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNewTask = () => {
        setTaskForm({
            id: Date.now(),
            title: "",
            description: "",
            assignedTo: "",
            status: "Pending",
            priority: "medium",
        });
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (err) {
            console.error("Failed to delete task:", err);
            alert("Could not delete task.");
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        setTasks(tasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
        ));
        try {
            await updateTask(taskId, { status: newStatus });
        } catch (error) {
            console.error("Failed to update task status:", error);
            alert("Could not update task status.");
        }
    };

    const getInitials = (name = "") => {
        if (!name.trim()) return "";
        const parts = name.trim().split(" ");
        return parts.length === 1
            ? parts[0].slice(0, 2).toUpperCase()
            : (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const handleJoinRequest = async (requestId, isApproved) => {
        try {
            await joinRequest(groupId, requestId, { action: isApproved ? "approve" : "reject" });
            const updatedRequests = group.joinRequests.filter(req => req._id !== requestId);
            const updatedMembers = isApproved
                ? [...group.members, group.joinRequests.find(req => req._id === requestId).user]
                : group.members;

            setGroup(prev => ({
                ...prev,
                joinRequests: updatedRequests,
                members: updatedMembers
            }));
        } catch (err) {
            console.error("Failed to approve request:", err);
        }
    };

    const handleLeaveGroup = () => {
        navigate("/dashboard");
    };

    const getPriorityColor = (priority) => ({
        high: "bg-red-600",
        medium: "bg-yellow-600",
        low: "bg-blue-600",
    }[priority] || "bg-gray-600");

    const filteredTasks = tasks.filter(task =>
        priorityFilter ? task.priority === priorityFilter : true
    );

    const completeTasks = filteredTasks.filter(task => task.status === "Complete");
    const activeTasks = filteredTasks.filter(task => task.status !== "Complete");

    const TaskCard = ({ task, index }) => (
        <div key={task._id || task.id || `task-${index}`} className="bg-gray-800 p-6 rounded-md border border-gray-700 flex flex-col max-sm:gap-1">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <button onClick={() => handleDeleteTask(task._id)}><Trash2 size={14} className="text-red-500" /></button>
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-2">{task.description}</p>
            <div className="flex justify-between sm:items-center sm:flex-row flex-col max-sm:space-y-3">
                <span className="text-xs">
                    {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                        ? `Assigned to ${task.assignedTo.map(user => user.name).join(", ")}`
                        : "Assigned to Everyone"}
                </span>
                <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                    className="text-xs bg-gray-700 px-3 py-1 rounded-md flex items-center"
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>
        </div>
    );

    if (!group) return <Loading text="Fetching details" />

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 sm:p-12 md:ml-56">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                <button
                    onClick={() => setIsLeaveGroupModalOpen(true)}
                    className="text-xs sm:text-sm text-red-400 border border-gray-700 px-3 py-1 rounded-md"
                >
                    <LogOut size={14} className="inline mr-2" />
                    Leave Group
                </button>
            </div>

            {group.joinRequests?.length > 0 && (
                <div className="mb-6 bg-gray-800 p-4 rounded-md">
                    <h2 className="font-semibold mb-2">Pending Join Requests</h2>
                    {group.joinRequests.map((req) => (
                        <div key={req._id} className="flex justify-between items-center mb-2 bg-gray-700 p-3 rounded-md">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                                    {getInitials(req.user.name)}
                                </div>
                                <p>{req.user.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleJoinRequest(req._id, true)} className="bg-green-600 px-2 py-1 rounded-md text-sm">
                                    Approve
                                </button>
                                <button onClick={() => handleJoinRequest(req._id, false)} className="bg-red-600 px-2 py-1 rounded-md text-sm">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
                {group.members.map((member) => (
                    <div key={member._id} className="flex items-center bg-gray-800 rounded-full px-3 py-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-2">
                            {getInitials(member.name)}
                        </div>
                        {member.name}
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Active Tasks</h2>
                    <div className="relative" ref={priorityDropdownRef}>
                        <button
                            onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                            className="text-xs bg-gray-700 px-2 py-1 rounded-md flex items-center"
                        >
                            <Filter size={12} className="mr-1" />
                            Filter
                            <ChevronDown size={12} className="ml-1" />
                        </button>
                        {isPriorityDropdownOpen && (
                            <div className="absolute mt-2 bg-gray-800 rounded-md shadow-md text-sm z-10 overflow-hidden">
                                {["high", "medium", "low", null].map(p => (
                                    <button
                                        key={p ?? "all"}
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${priorityFilter === p ? "bg-gray-700" : ""}`}
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
                <button onClick={handleNewTask} className="bg-blue-600 px-3 py-2 rounded-md text-xs sm:text-sm flex items-center">
                    <Plus size={14} className="mr-1" />
                    New Task
                </button>
            </div>

            <div className="space-y-4 mb-8">
                {activeTasks.length > 0 ? (
                    activeTasks.map((task, index) => (
                        <TaskCard key={task._id || `active-${index}`} task={task} index={index} />
                    ))
                ) : (
                    <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-md">
                        {priorityFilter ? `No ${priorityFilter} priority tasks to work on.` : "No active tasks available."}
                    </div>
                )}
            </div>

            {completeTasks.length > 0 && (
                <>
                    <div className="flex items-center mb-4 mt-8 border-t border-gray-700 pt-6">
                        <h2 className="text-xl font-semibold text-gray-300">Completed Tasks</h2>
                    </div>
                    <div className="space-y-4 opacity-80">
                        {completeTasks.map((task, index) => (
                            <TaskCard key={task._id || `complete-${index}`} task={task} index={index} />
                        ))}
                    </div>
                </>
            )}

            <GroupModals
                isTaskModalOpen={isTaskModalOpen}
                setIsTaskModalOpen={setIsTaskModalOpen}
                group={group}
                groupId={groupId}
                setTasks={setTasks}
                taskForm={taskForm}
                setTaskForm={setTaskForm}
                isLeaveGroupModalOpen={isLeaveGroupModalOpen}
                setIsLeaveGroupModalOpen={setIsLeaveGroupModalOpen}
                handleLeaveGroup={handleLeaveGroup}
            />
        </div>
    );
};

export default GroupDetails;