import React, { useEffect, useState } from "react";
import {
    List,
    Plus,
    MoreVertical,
    Copy,
    CheckCircle,
    UserMinus,
    UserPlus,
} from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { fetchTaskGroups, leaveGroup } from "../utils/taskAPI";
import { colorMap } from "./colorMap";

const GroupsSidebar = ({
    toggleSidebar,
    activeGroupMenu,
    setActiveGroupMenu,
    isGroupOptionsOpen,
    setIsGroupOptionsOpen,
    groupOptionsRef,
    groupMenuRef,
    copySuccess,
    copyGroupCode,
    setIsCreateGroupModalOpen,
    setIsJoinGroupModalOpen,
}) => {
    const [taskGroups, setTaskGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await fetchTaskGroups();
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const tasksWithColors = res.data.filter(group =>
                    group.members.some(m => m._id === currentUser._id)
                );
                setTaskGroups(tasksWithColors);
            } catch (err) {
                console.error("Error loading groups in sidebar:", err);
            }
        };

        fetchGroups();
        window.addEventListener("groupRefresh", fetchGroups);
        return () => window.removeEventListener("groupRefresh", fetchGroups);
    }, [taskGroups]);

    const handleGroupClick = (groupId) => {
        navigate(`/group/${groupId}`);
        toggleSidebar();
    };

    const handleLeaveGroup = async (groupId) => {
        setTaskGroups(taskGroups.filter(group => group.id !== groupId));
        console.log(groupId)
        setActiveGroupMenu(null);
        try {
            await leaveGroup(groupId)

            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <li className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-white cursor-pointer">
                <div className="flex items-center space-x-2" onClick={toggleSidebar}>
                    <NavLink
                        to="/task-groups"
                        className="flex items-center space-x-2 text-white"
                    >
                        <List className="h-5 w-5" />
                        <span>Task Groups</span>
                    </NavLink>
                </div>
                <div className="flex items-center relative" ref={groupOptionsRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsGroupOptionsOpen(!isGroupOptionsOpen);
                        }}
                        className="hover:bg-blue-100 rounded-full p-1"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                    {isGroupOptionsOpen && (
                        <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg z-40 w-40 overflow-hidden">
                            <ul className="">
                                <li>
                                    <button
                                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setIsGroupOptionsOpen(false);
                                            setIsCreateGroupModalOpen(true);
                                        }}
                                    >
                                        <Plus size={14} className="mr-2" /> Create Group
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setIsGroupOptionsOpen(false);
                                            setIsJoinGroupModalOpen(true);
                                        }}
                                    >
                                        <UserPlus size={14} className="mr-2" /> Join Group
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {taskGroups.length > 0 && (
                <>
                    <hr className="h-px bg-accent-stroke border-0" />
                    <ul className="space-y-3 pl-1">
                        {taskGroups.map((group) => (
                            <li
                                key={group._id}
                                className="flex items-center justify-between text-gray-200 hover:text-white cursor-pointer"
                            >
                                <div
                                    className="flex items-center space-x-2"
                                    onClick={() => handleGroupClick(group._id)}
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full ${colorMap[group.color]?.bg || "bg-gray-500"}`}
                                    />
                                    <span className="truncate max-w-[130px]">{group.name}</span>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveGroupMenu(
                                                activeGroupMenu === group._id ? null : group._id
                                            );
                                        }}
                                        className="text-gray-500 hover:text-white p-1 rounded-full"
                                    >
                                        <MoreVertical size={14} />
                                    </button>

                                    {activeGroupMenu === group._id && (
                                        <div
                                            className="absolute right-0 top-6 bg-white rounded-md shadow-lg z-40 w-44"
                                            ref={groupMenuRef}
                                        >
                                            <ul className="py-1">
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 text-sm"
                                                        onClick={() => {
                                                            copyGroupCode(group.code);
                                                            setActiveGroupMenu(null);
                                                        }}
                                                    >
                                                        {copySuccess ? (
                                                            <CheckCircle
                                                                size={14}
                                                                className="mr-2 text-green-500"
                                                            />
                                                        ) : (
                                                            <Copy size={14} className="mr-2" />
                                                        )}
                                                        Copy Invite Code
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-blue-50 text-sm"
                                                        onClick={() => {
                                                            handleLeaveGroup(group._id);
                                                            setActiveGroupMenu(null);
                                                        }}
                                                    >
                                                        <UserMinus size={14} className="mr-2" />
                                                        Leave Group
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </li>
    );
};

export default GroupsSidebar;