import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import { createTask } from "../utils/taskAPI";

const GroupModals = ({
    isTaskModalOpen,
    setIsTaskModalOpen,
    group,
    groupId,
    setTasks,
    taskForm,
    setTaskForm,
    currentTask,
    setCurrentTask,

    isLeaveGroupModalOpen,
    setIsLeaveGroupModalOpen,
    handleLeaveGroup
}) => {

    const emptyTaskForm = {
        id: null,
        title: "",
        description: "",
        assignedTo: "",
        status: "Pending",
        priority: "medium"
    };

    const saveTask = async () => {
        if (!taskForm.title.trim()) return;

        const payload = {
            ...taskForm,
            groupId,
            assignedTo: taskForm.assignedTo === "Everyone"
                ? null
                : group.members.find(m => m.name === taskForm.assignedTo)?._id ?? null
        };

        try {
            const res = await createTask(payload);
            setTasks(prev => [...prev, res.data]);
            setIsTaskModalOpen(false);
            setTaskForm(emptyTaskForm);
        } catch (err) {
            console.error("Failed to create task:", err);
        }
    };

    const handleTaskFormChange = (e) => {
        const { name, value } = e.target;
        setTaskForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
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
                                    <option key={member._id} value={member.name}>
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

            <Modal
                isOpen={isLeaveGroupModalOpen}
                onClose={() => setIsLeaveGroupModalOpen(false)}
                title="Leave Group"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-center py-4 text-center">
                        <div className="bg-gray-700 p-4 rounded-full">
                            <AlertTriangle size={32} className="text-yellow-500" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">Are you sure you want to leave this group?</h3>
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
