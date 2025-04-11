import React, { useState, useRef, useEffect } from "react";
import {
    Pencil, Trash2, Plus, MoreVertical, Filter, ChevronDown, LogOut,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import GroupModals from "../components/GroupModals";
import { getGroupById } from "../utils/taskAPI";

const GroupDetails = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [priorityFilter, setPriorityFilter] = useState(null);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
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
    const [newMemberName, setNewMemberName] = useState("");
    const priorityDropdownRef = useRef(null);

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

    useEffect(() => {
        fetchGroupData();

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

    const handleTaskFormChange = (e) => {
        const { name, value } = e.target;
        setTaskForm(prev => ({ ...prev, [name]: value }));
    };

    const saveTask = () => {
        if (!taskForm.title.trim()) return;
        if (currentTask) {
            setTasks(tasks.map(t => t.id === currentTask.id ? { ...taskForm } : t));
        } else {
            setTasks([...tasks, { ...taskForm }]);
        }
        setIsTaskModalOpen(false);
    };

    const addMember = () => {
        if (!newMemberName.trim()) return;
        const newMember = {
            id: Date.now(),
            name: newMemberName,
            initials: newMemberName.split(" ").map((n) => n[0]).join(""),
        };
        setGroup(prev => ({ ...prev, members: [...prev.members, newMember] }));
        setNewMemberName("");
        setIsAddMemberModalOpen(false);
    };

    const handleJoinRequest = (requestId, isApproved) => {
        const request = group.joinRequests.find((r) => r.id === requestId);
        if (!request) return;

        if (isApproved) {
            setGroup(prev => ({
                ...prev,
                members: [...prev.members, request],
                joinRequests: prev.joinRequests.filter(r => r.id !== requestId)
            }));
        } else {
            setGroup(prev => ({
                ...prev,
                joinRequests: prev.joinRequests.filter(r => r.id !== requestId)
            }));
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
                    className="text-sm text-red-400 border border-gray-700 px-3 py-1 rounded-md"
                >
                    <LogOut size={14} className="inline mr-2" />
                    Leave Group
                </button>
            </div>

            {group.joinRequests?.length > 0 && (
                <div className="mb-6 bg-gray-800 p-4 rounded-md">
                    <h2 className="font-semibold mb-2">Pending Join Requests</h2>
                    {group.joinRequests.map((req) => (
                        <div key={req.id} className="flex justify-between items-center mb-2 bg-gray-700 p-3 rounded-md">
                            <span>{req.name}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleJoinRequest(req.id, true)} className="bg-green-600 px-2 py-1 rounded-md text-sm">
                                    Approve
                                </button>
                                <button onClick={() => handleJoinRequest(req.id, false)} className="bg-red-600 px-2 py-1 rounded-md text-sm">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
                {group.members.map((member) => (
                    <div key={member.id} className="bg-gray-800 px-3 py-2 rounded-full text-sm">
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
                <button onClick={handleNewTask} className="bg-blue-600 px-3 py-2 rounded-md text-sm flex items-center">
                    <Plus size={14} className="mr-1" />
                    New Task
                </button>
            </div>

            <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <div key={task.id} className="bg-gray-800 p-4 rounded-md border border-gray-700">
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
                                    {task.assignedTo === "Everyone" ? "Assigned to Everyone" : `Assigned to ${task.assignedTo}`}
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
                isAddMemberModalOpen={isAddMemberModalOpen}
                setIsAddMemberModalOpen={setIsAddMemberModalOpen}
                newMemberName={newMemberName}
                setNewMemberName={setNewMemberName}
                addMember={addMember}
                isTaskModalOpen={isTaskModalOpen}
                setIsTaskModalOpen={setIsTaskModalOpen}
                taskForm={taskForm}
                setTaskForm={setTaskForm}
                handleTaskFormChange={handleTaskFormChange}
                saveTask={saveTask}
                currentTask={currentTask}
                emptyTaskForm={{
                    id: null,
                    title: "",
                    description: "",
                    assignedTo: "",
                    status: "Pending",
                    priority: "medium"
                }}
                group={group}
                isLeaveGroupModalOpen={isLeaveGroupModalOpen}
                setIsLeaveGroupModalOpen={setIsLeaveGroupModalOpen}
                handleLeaveGroup={handleLeaveGroup}
            />
        </div>
    );
};

export default GroupDetails;