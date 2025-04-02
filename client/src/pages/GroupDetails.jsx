import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Plus, User, MoreVertical, UserPlus, UserMinus, X, Filter, ChevronDown } from "lucide-react";
import { useParams } from "react-router-dom";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-md mx-auto border border-accent-stroke">
                <div className="flex justify-between items-center border-b border-gray-700 p-4">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const GroupDetails = () => {
    const { groupId } = useParams();
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "Design System Update",
            description: "Update color palette and component library",
            assignedTo: "Jane Smith",
            status: "Complete",
            priority: "high",
        },
        {
            id: 2,
            title: "Mobile App Wireframes",
            description: "Create wireframes for new mobile app features",
            assignedTo: "Everyone",
            status: "In Progress",
            priority: "medium",
        },
        {
            id: 3,
            title: "User Testing Plan",
            description: "Prepare user testing scenarios and recruitment",
            assignedTo: "John Doe",
            status: "Pending",
            priority: "low",
        },
    ]);

    const [group, setGroup] = useState({
        id: groupId,
        name: "Design Team",
        members: [
            { id: 1, name: "John Doe", initials: "JD" },
            { id: 2, name: "Jane Smith", initials: "JS" },
            { id: 3, name: "Mike Johnson", initials: "MJ" },
        ],
    });

    const [activeMenu, setActiveMenu] = useState(null);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const [currentTask, setCurrentTask] = useState(null);
    const [newMemberName, setNewMemberName] = useState("");
    const menuRef = useRef(null);
    const priorityDropdownRef = useRef(null);

    const emptyTaskForm = {
        id: null,
        title: "",
        description: "",
        assignedTo: "",
        status: "Pending",
        priority: "medium"
    };

    const [taskForm, setTaskForm] = useState(emptyTaskForm);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
            if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target)) {
                setIsPriorityDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
        setActiveMenu(null);
    };

    const handleUpdateStatus = (taskId, newStatus) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setTaskForm({ ...task });
        setIsTaskModalOpen(true);
        setActiveMenu(null);
    };

    const handleNewTask = () => {
        setCurrentTask(null);
        setTaskForm({ ...emptyTaskForm, id: Date.now() });
        setIsTaskModalOpen(true);
    };

    const handleTaskFormChange = (e) => {
        const { name, value } = e.target;
        setTaskForm(prev => ({ ...prev, [name]: value }));
    };

    const saveTask = () => {
        if (!taskForm.title.trim()) return;

        if (currentTask) {
            setTasks(tasks.map(task =>
                task.id === currentTask.id ? { ...taskForm } : task
            ));
        } else {
            setTasks([...tasks, { ...taskForm }]);
        }

        setIsTaskModalOpen(false);
        setTaskForm(emptyTaskForm);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Complete":
                return "bg-green-600";
            case "In Progress":
                return "bg-blue-600";
            case "Pending":
                return "bg-gray-600";
            default:
                return "bg-gray-600";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "bg-red-600";
            case "medium":
                return "bg-yellow-600";
            case "low":
                return "bg-blue-600";
            default:
                return "bg-gray-600";
        }
    };

    const addMember = () => {
        if (newMemberName.trim()) {
            const initials = newMemberName
                .split(" ")
                .map(name => name[0])
                .join("");

            const newMember = {
                id: Date.now(),
                name: newMemberName,
                initials: initials
            };

            setGroup({
                ...group,
                members: [...group.members, newMember]
            });

            setNewMemberName("");
            setIsAddMemberModalOpen(false);
        }
    };

    const removeMember = (memberId) => {
        setGroup({
            ...group,
            members: group.members.filter(member => member.id !== memberId)
        });
    };

    const filteredTasks = tasks.filter(task => {
        if (priorityFilter === null) return true;
        return task.priority === priorityFilter;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 md:ml-56">
            <h1 className="text-2xl font-bold mb-6">{group.name}</h1>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Team Members</h2>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-sm md:text-base md:px-3 rounded-md flex items-center"
                        onClick={() => setIsAddMemberModalOpen(true)}
                    >
                        <UserPlus size={14} className="mr-1" />
                        <span className="hidden sm:inline">Add Member</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {group.members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center bg-gray-800 rounded-full px-3 py-1 group relative"
                        >
                            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-2">
                                {member.initials}
                            </div>
                            <span>{member.name}</span>
                            <button
                                className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMember(member.id)}
                                title="Remove member"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <h2 className="text-xl font-semibold mr-2">Tasks</h2>
                        <div className="relative" ref={priorityDropdownRef}>
                            <button
                                className="bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 text-xs rounded flex items-center"
                                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                            >
                                <Filter size={12} className="mr-1" />
                                Filter
                                <ChevronDown size={12} className="ml-1" />
                            </button>

                            {isPriorityDropdownOpen && (
                                <div className="absolute left-0 mt-1 bg-gray-700 rounded-md shadow-lg z-10 w-36">
                                    <ul className="py-1 text-sm">
                                        <li>
                                            <button
                                                className={`w-full text-left px-3 py-2 hover:bg-gray-600 ${priorityFilter === "high" ? "bg-gray-600" : ""}`}
                                                onClick={() => {
                                                    setPriorityFilter("high");
                                                    setIsPriorityDropdownOpen(false);
                                                }}
                                            >
                                                High Priority Only
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`w-full text-left px-3 py-2 hover:bg-gray-600 ${priorityFilter === "medium" ? "bg-gray-600" : ""}`}
                                                onClick={() => {
                                                    setPriorityFilter("medium");
                                                    setIsPriorityDropdownOpen(false);
                                                }}
                                            >
                                                Medium Priority Only
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`w-full text-left px-3 py-2 hover:bg-gray-600 ${priorityFilter === "low" ? "bg-gray-600" : ""}`}
                                                onClick={() => {
                                                    setPriorityFilter("low");
                                                    setIsPriorityDropdownOpen(false);
                                                }}
                                            >
                                                Low Priority Only
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`w-full text-left px-3 py-2 hover:bg-gray-600 ${priorityFilter === null ? "bg-gray-600" : ""}`}
                                                onClick={() => {
                                                    setPriorityFilter(null);
                                                    setIsPriorityDropdownOpen(false);
                                                }}
                                            >
                                                Show All
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-sm md:text-base md:px-3 rounded-md flex items-center"
                        onClick={handleNewTask}
                    >
                        <Plus size={14} className="mr-1" />
                        <span>New Task</span>
                    </button>
                </div>

                {priorityFilter !== null && (
                    <div className="bg-gray-800 text-sm rounded-md p-2 mb-3 flex justify-between items-center">
                        <span>
                            Showing only <strong className="capitalize">{priorityFilter}</strong> priority tasks
                        </span>
                        <button
                            className="text-gray-400 hover:text-white"
                            onClick={() => setPriorityFilter(null)}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="space-y-3">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-gray-800 rounded-lg p-4 relative border border-accent-stroke"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-start gap-2">
                                        <h3 className="font-medium">{task.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)} uppercase`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div className="relative" ref={activeMenu === task.id ? menuRef : null}>
                                        <button
                                            className="text-gray-400 hover:text-white"
                                            onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {/* Task actions menu */}
                                        {activeMenu === task.id && (
                                            <div className="absolute right-0 top-6 bg-gray-700 rounded-md shadow-lg overflow-hidden z-10 w-24">
                                                <ul>
                                                    <li>
                                                        <button
                                                            className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-600"
                                                            onClick={() => handleEditTask(task)}
                                                        >
                                                            <Pencil size={14} className="mr-2" /> Edit
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-600 text-red-400 hover:text-red-300"
                                                            onClick={() => handleDeleteTask(task.id)}
                                                        >
                                                            <Trash2 size={14} className="mr-2" /> Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex items-center text-sm text-gray-400">
                                        {task.assignedTo === "Everyone" ? (
                                            <span>Assigned to Everyone</span>
                                        ) : (
                                            <>
                                                <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-2">
                                                    {task.assignedTo
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </div>
                                                <span className="text-xs sm:text-sm">Assigned to {task.assignedTo}</span>
                                            </>
                                        )}
                                    </div>
                                    <select
                                        className={`text-xs rounded-md px-2 py-1 text-white ${getStatusColor(
                                            task.status
                                        )} self-start sm:self-auto`}
                                        value={task.status}
                                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Complete">Complete</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
                            {priorityFilter ?
                                `No ${priorityFilter} priority tasks found` :
                                "No tasks found"}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isAddMemberModalOpen}
                onClose={() => {
                    setIsAddMemberModalOpen(false);
                    setNewMemberName("");
                }}
                title="Add Team Member"
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="memberName" className="block text-sm font-medium text-gray-300 mb-1">
                            Member Name
                        </label>
                        <input
                            id="memberName"
                            type="text"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="Enter full name"
                            className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md"
                            onClick={() => {
                                setIsAddMemberModalOpen(false);
                                setNewMemberName("");
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
                            onClick={addMember}
                        >
                            Add Member
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setTaskForm(emptyTaskForm);
                }}
                title={currentTask ? "Edit Task" : "New Task"}
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-300 mb-1">
                            Task Title
                        </label>
                        <input
                            id="taskTitle"
                            name="title"
                            type="text"
                            value={taskForm.title}
                            onChange={handleTaskFormChange}
                            placeholder="Enter task title"
                            className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            id="taskDescription"
                            name="description"
                            value={taskForm.description}
                            onChange={handleTaskFormChange}
                            placeholder="Enter task description"
                            rows="3"
                            className="bg-gray-700 text-white px-3 py-2 rounded-md w-full resize-none"
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="taskAssignee" className="block text-sm font-medium text-gray-300 mb-1">
                                Assigned To
                            </label>
                            <select
                                id="taskAssignee"
                                name="assignedTo"
                                value={taskForm.assignedTo}
                                onChange={handleTaskFormChange}
                                className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                            >
                                <option value="Everyone">Everyone</option>
                                {group.members.map(member => (
                                    <option key={member.id} value={member.name}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-300 mb-1">
                                Priority
                            </label>
                            <select
                                id="taskPriority"
                                name="priority"
                                value={taskForm.priority}
                                onChange={handleTaskFormChange}
                                className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md"
                            onClick={() => {
                                setIsTaskModalOpen(false);
                                setTaskForm(emptyTaskForm);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
                            onClick={saveTask}
                            disabled={!taskForm.title.trim()}
                        >
                            {currentTask ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GroupDetails;