import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import { createTask, updateTask, } from "../utils/taskAPI";

const GroupModals = ({
    isTaskModalOpen,
    setIsTaskModalOpen,
    group,
    groupId,
    setTasks,
    taskForm,
    setTaskForm,
    isLeaveGroupModalOpen,
    setIsLeaveGroupModalOpen,
    handleLeaveGroup
}) => {

    const emptyTaskForm = {
        id: null,
        title: "",
        description: "",
        assignedTo: [],
        status: "Pending",
        priority: "medium"
    };

    const [assignToAll, setAssignToAll] = useState(false);

    // Set assignToAll state based on whether all members are assigned
    useEffect(() => {
        if (taskForm.assignedTo.length > 0 && group.members.length > 0) {
            const allAssigned = group.members.every(member =>
                taskForm.assignedTo.includes(member._id)
            );
            setAssignToAll(allAssigned);
        } else {
            setAssignToAll(false);
        }
    }, [taskForm.assignedTo, group.members]);

    const saveTask = async () => {
        if (!taskForm.title.trim()) return;
        try {
            const payload = {
                ...taskForm,
                assignedTo: assignToAll ? group.members.map(m => m._id) : taskForm.assignedTo,
                groupId
            };

            if (taskForm._id) {
                await updateTask(taskForm._id, payload);
                setTasks(prev => prev.map(t => t._id === taskForm._id ? { ...t, ...payload } : t));
            } else {
                const res = await createTask(payload);
                setTasks(prev => [...prev, res.data]);
            }

            setIsTaskModalOpen(false);
            setTaskForm(emptyTaskForm);
            setAssignToAll(false);
        } catch (err) {
            console.error("Failed to save task:", err);
        }
    };

    const handleTaskFormChange = (e) => {
        const { name, value } = e.target;
        setTaskForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = async (e) => {
        const { value, checked } = e.target;

        // Update the local state
        setTaskForm(prev => {
            const updated = checked
                ? [...prev.assignedTo, value]
                : prev.assignedTo.filter(id => id !== value);
            return { ...prev, assignedTo: updated };
        });

        // If unchecking a user and we're editing an existing task, remove the user from the task in backend
        if (!checked && taskForm._id) {
            try {
                await removeUserFromTask(taskForm._id, value);
                // Tasks state will be updated automatically when the task is saved
            } catch (err) {
                console.error("Failed to remove user from task:", err);
            }
        }
    };

    const toggleAssignToAll = () => {
        if (!assignToAll) {
            setTaskForm(prev => ({
                ...prev,
                assignedTo: group.members.map(m => m._id)
            }));
        } else {
            setTaskForm(prev => ({
                ...prev,
                assignedTo: []
            }));
        }
        setAssignToAll(prev => !prev);
    };

    return (
        <>
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setTaskForm(emptyTaskForm);
                    setAssignToAll(false);
                }}
                title="New Task"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Task
                        </label>
                        <input
                            name="title"
                            type="text"
                            value={taskForm.title}
                            onChange={handleTaskFormChange}
                            placeholder="Enter task title"
                            className="input-box w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={taskForm.description}
                            onChange={handleTaskFormChange}
                            placeholder="Enter task description"
                            rows="3"
                            className="input-box w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={taskForm.priority}
                                onChange={handleTaskFormChange}
                                className="bg-gray-700 text-white px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Assign Task
                            </label>
                            <div className="flex items-center justify-between p-3 border-b border-b-accent-stroke">
                                <span className="text-gray-300">Assign to Everyone</span>
                                <button
                                    type="button"
                                    onClick={toggleAssignToAll}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${assignToAll ? 'bg-blue-600' : 'bg-gray-600'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${assignToAll ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <div
                                className={`mt-1 max-h-40 overflow-y-auto space-y-3 bg-gray-800 p-3 rounded-md ${group.members.length > 4 ? 'scrollbar-thin scrollbar-thumb-gray-600' : ''}`}
                            >
                                <p className="text-sm text-gray-400 mb-4">Select Specific Members:</p>
                                {group.members.map((member) => (
                                    <label
                                        key={member._id}
                                        className="container flex gap-3 items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            value={member._id}
                                            checked={taskForm.assignedTo.includes(member._id)}
                                            onChange={handleCheckboxChange}
                                        />
                                        <div className="checkmark"></div>
                                        {member.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md"
                            onClick={() => {
                                setIsTaskModalOpen(false);
                                setTaskForm(emptyTaskForm);
                                setAssignToAll(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className= "bg-gray-800 hover:bg-green-600 text-green-600 hover:text-white border border-green-600 px-4 py-2 rounded-md transition-colors duration-200"
                            onClick={saveTask}
                            disabled={!taskForm.title.trim()}
                        >
                            Create Task
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isLeaveGroupModalOpen}
                onClose={() => setIsLeaveGroupModalOpen(false)}
                title="Leave Group"
            >
                <div className="space-y-4">
                    <div className="flex justify-center py-4 text-center">
                        <div className="bg-gray-700 p-4 rounded-full">
                            <AlertTriangle size={32} className="text-yellow-500" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">
                            Are you sure you want to leave this group?
                        </h3>
                        <p className="text-gray-400 text-sm">
                            You'll lose access to all tasks and will need an invite to rejoin.
                        </p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium"
                            onClick={() => setIsLeaveGroupModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-gray-800 hover:bg-red-700 text-gray-300 hover:text-white border border-red-600 px-4 py-2 rounded-md transition-colors duration-200"
                            onClick={handleLeaveGroup}
                        >
                            Leave Group
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default GroupModals;