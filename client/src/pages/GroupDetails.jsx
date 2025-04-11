import React, { useEffect, useState, useRef } from "react";
import {
    Pencil, Trash2, Plus, Filter, ChevronDown, LogOut
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import GroupModals from "../components/GroupModals";
import { getGroupById, joinRequest } from "../utils/taskAPI";

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

    const [currentTask, setCurrentTask] = useState(null);
    const priorityDropdownRef = useRef(null);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const res = await getGroupById(groupId);
                setGroup(res.data);
                console.log(res.data)
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
        setCurrentTask(null);
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

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setTaskForm(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const handleUpdateStatus = (taskId, newStatus) => {
        setTasks(tasks.map((task) => task.id === taskId ? { ...task, status: newStatus } : task));
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

    const getStatusColor = (status) => ({
        Complete: "bg-green-600",
        "In Progress": "bg-blue-600",
        Pending: "bg-gray-600",
    }[status] || "bg-gray-600");

    const filteredTasks = tasks.filter(task =>
        priorityFilter ? task.priority === priorityFilter : true
    );

    if (!group) return <div className="text-white p-10">Loading...</div>;

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
                    <h2 className="text-xl font-semibold">Tasks</h2>
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
                            <div className="absolute mt-2 bg-gray-800 rounded-md shadow-md text-sm z-10">
                                {["high", "medium", "low", null].map(p => (
                                    <button
                                        key={p ?? "all"}
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${priorityFilter === p ? "bg-gray-700" : ""}`}
                                        onClick={() => {
                                            setPriorityFilter(p);
                                            setIsPriorityDropdownOpen(false);
                                        }}
                                    >
                                        {p ? `${p.charAt(0).toUpperCase() + p.slice(1)} Priority` : "Show All"}
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

            <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => (
                        <div key={task._id || task.id || `task-${index}`} className="bg-gray-800 p-4 rounded-md border border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{task.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <button onClick={() => handleEditTask(task)}><Pencil size={14} /></button>
                                    <button onClick={() => handleDeleteTask(task.id)}><Trash2 size={14} className="text-red-500" /></button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs">
                                    {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                                        ? `Assigned to ${task.assignedTo.map(user => user.name).join(", ")}`
                                        : "Assigned to Everyone"}
                                </span>
                                <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                                    className={`text-xs px-3 py-1 rounded-md ${getStatusColor(task.status)}`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Complete">Complete</option>
                                </select>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-md">
                        {priorityFilter ? `No ${priorityFilter} priority tasks.` : "No tasks available."}
                    </div>
                )}
            </div>

            <GroupModals
                isTaskModalOpen={isTaskModalOpen}
                setIsTaskModalOpen={setIsTaskModalOpen}
                group={group}
                groupId={groupId}
                setTasks={setTasks}
                taskForm={taskForm}
                setTaskForm={setTaskForm}
                currentTask={currentTask}
                setCurrentTask={setCurrentTask}
                isLeaveGroupModalOpen={isLeaveGroupModalOpen}
                setIsLeaveGroupModalOpen={setIsLeaveGroupModalOpen}
                handleLeaveGroup={handleLeaveGroup}
            />
        </div>
    );
};

export default GroupDetails;
