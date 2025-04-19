import React, { useState, useRef, useEffect } from "react";
import { Menu, User, Home, X, LogOut, CheckCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { createGroup, joinGroupByCode } from "../utils/taskAPI";
import axios from "axios";
import GroupsSidebar from "./GroupsSidebar";
import Modal from "./Modal";
import { colorMap } from "./colorMap";

const Navigation = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [taskGroups, setTaskGroups] = useState([]);
    const [activeGroupMenu, setActiveGroupMenu] = useState(null);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);
    const [isGroupOptionsOpen, setIsGroupOptionsOpen] = useState(false);
    const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
    const [groupForm, setGroupForm] = useState({
        name: "",
        description: "",
        color: "gray"
    });
    const [joinGroupCode, setJoinGroupCode] = useState("");
    const [joinSuccess, setJoinSuccess] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const groupMenuRef = useRef(null);
    const groupOptionsRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (groupMenuRef.current && !groupMenuRef.current.contains(event.target)) {
                setActiveGroupMenu(null);
            }
            if (groupOptionsRef.current && !groupOptionsRef.current.contains(event.target)) {
                setIsGroupOptionsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfilePopoverOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLeaveGroup = (groupId) => {
        setTaskGroups(taskGroups.filter(group => group.id !== groupId));
        setActiveGroupMenu(null);
    };

    const handleCreateGroup = async () => {
        if (groupForm.name.trim()) {
            try {
                const res = await createGroup(groupForm);
                setTaskGroups(prev => [...prev, res.data]);
                setGroupForm({ name: "", description: "", color: "gray" });
                setIsCreateGroupModalOpen(false);
            } catch (err) {
                console.error("Failed to create group:", err);
            }
        }
    };

    const handleJoinGroup = async () => {
        if (joinGroupCode.trim()) {
            try {
                const res = await joinGroupByCode(joinGroupCode);

                setJoinSuccess(true);
                setTimeout(() => {
                    setJoinSuccess(false);
                    setJoinGroupCode("");
                    setIsJoinGroupModalOpen(false);
                }, 1500);
            } catch (err) {
                const errorMsg = err?.response?.data?.message;

                if (errorMsg === "You are already a member of this group.") {
                    alert("You're already a member of this group.");
                } else if (errorMsg === "You have already requested to join this group.") {
                    alert("You have already requested to join this group.");
                } else if (err?.response?.status === 404) {
                    alert("Group not found.");
                } else {
                    console.error("Failed to join group:", err);
                    alert("Something went wrong while trying to join the group.");
                }
            }
        }
    };

    const copyGroupCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {}, {
                withCredentials: true,
            });
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            localStorage.clear();
            window.dispatchEvent(new Event('authChanged'));
            delete axios.defaults.headers.common["Authorization"];

            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    return (
        <>
            <aside
                className={`fixed top-0 left-0 h-full w-56 bg-blue-200 transform transition-transform duration-300 ease-in-out z-30 px-3 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="p-4 flex justify-middle items-center">
                    {sidebarOpen && (
                        <button onClick={toggleSidebar} className="md:hidden">
                            <X className="h-6 w-6 mr-4" />
                        </button>
                    )}
                    <h2 className="text-xl font-bold sm:mt-2">TaskMe</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-5">
                        <li>
                            <NavLink to='/dashboard' className="flex items-center space-x-2 text-white cursor-pointer">
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </NavLink>
                        </li>
                        <GroupsSidebar
                            activeGroupMenu={activeGroupMenu}
                            setActiveGroupMenu={setActiveGroupMenu}
                            copySuccess={copySuccess}
                            copyGroupCode={copyGroupCode}
                            handleLeaveGroup={handleLeaveGroup}
                            groupMenuRef={groupMenuRef}
                            colorMap={colorMap}
                            isGroupOptionsOpen={isGroupOptionsOpen}
                            setIsGroupOptionsOpen={setIsGroupOptionsOpen}
                            groupOptionsRef={groupOptionsRef}
                            setIsCreateGroupModalOpen={setIsCreateGroupModalOpen}
                            setIsJoinGroupModalOpen={setIsJoinGroupModalOpen}
                            taskGroups={taskGroups}
                        />
                    </ul>
                </nav>
            </aside>
            <header className="bg-blue-200 p-4 flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="mr-4 md:hidden">
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <h2 className="text-xl font-bold md:hidden">TaskMe</h2>
                </div>
                <div className="relative" ref={profileRef}>
                    <button
                        className="rounded-full bg-blue-100 p-1"
                        onClick={() => setProfilePopoverOpen(!profilePopoverOpen)}
                    >
                        <User className="h-6 w-6" />
                    </button>
                    {profilePopoverOpen && (
                        <div className="absolute right-0 top-10 bg-white rounded-md shadow-lg z-40 w-40">
                            <ul className="py-1">
                                <li>
                                    <button
                                        className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-blue-50"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={14} className="mr-2" /> Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>
            <Modal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                title="Create New Group"
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="groupName" className="block text-sm font-medium mb-1 text-white">
                            Group Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="groupName"
                            type="text"
                            value={groupForm.name}
                            onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                            placeholder="Enter group name"
                            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="groupDescription" className="block text-sm font-medium mb-1 text-white">
                            Description
                        </label>
                        <textarea
                            id="groupDescription"
                            value={groupForm.description}
                            onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                            placeholder="Enter group description"
                            rows="3"
                            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md w-full resize-none"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="groupColor" className="block text-sm font-medium mb-1 text-white">
                            Color
                        </label>
                        <select
                            id="groupColor"
                            value={groupForm.color}
                            onChange={(e) => setGroupForm({ ...groupForm, color: e.target.value })}
                            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md w-full"
                        >
                            <option value="gray">Gray</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="red">Red</option>
                            <option value="purple">Purple</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md"
                            onClick={() => setIsCreateGroupModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
                            onClick={handleCreateGroup}
                            disabled={!groupForm.name.trim()}
                        >
                            Create Group
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={isJoinGroupModalOpen}
                onClose={() => {
                    setIsJoinGroupModalOpen(false);
                    setJoinGroupCode("");
                    setJoinSuccess(false);
                }}
                title="Join Group"
            >
                <div className="space-y-4">
                    {joinSuccess ? (
                        <div className="text-center py-4">
                            <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
                            <p className="text-gray-700">Join request sent successfully!</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="joinCode" className="block text-sm font-medium mb-1 text-gray-700">
                                    Group Invite Code
                                </label>
                                <input
                                    id="joinCode"
                                    type="text"
                                    value={joinGroupCode}
                                    onChange={(e) => setJoinGroupCode(e.target.value)}
                                    placeholder="Enter invite code"
                                    className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md w-full"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md"
                                    onClick={() => setIsJoinGroupModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
                                    onClick={handleJoinGroup}
                                    disabled={!joinGroupCode.trim()}
                                >
                                    Send Join Request
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Navigation;