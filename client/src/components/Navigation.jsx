import React, { useState, useRef, useEffect } from "react";
import { Menu, User, Home, List, Plus, X, MoreVertical, LogOut, UserPlus, Copy, CheckCircle, UserMinus } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

    const colorMap = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        red: "bg-red-500",
        purple: "bg-purple-500",
        gray: "bg-gray-500"
    };

    const [taskGroups, setTaskGroups] = useState([
        { id: 1, name: "Design Team", color: "blue", inviteCode: "design-123" },
        { id: 2, name: "Development", color: "green", inviteCode: "dev-456" },
        { id: 3, name: "QA Team", color: "red", inviteCode: "qa-789" },
        { id: 4, name: "Marketing", color: "purple", inviteCode: "mkt-101" }
    ]);

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

    const handleGroupClick = (groupId) => {
        console.log(`Navigating to group ${groupId}`);
    };

    const handleGroupOptions = (e) => {
        e.stopPropagation();
        setIsGroupOptionsOpen(!isGroupOptionsOpen);
    };

    const handleLeaveGroup = (groupId) => {
        setTaskGroups(taskGroups.filter(group => group.id !== groupId));
        setActiveGroupMenu(null);
    };

    const handleCreateGroup = () => {
        if (groupForm.name.trim()) {
            const newGroup = {
                id: Date.now(),
                name: groupForm.name,
                description: groupForm.description,
                color: groupForm.color,
                inviteCode: `${groupForm.name.toLowerCase().substring(0, 4)}-${Date.now().toString().substring(9)}`
            };

            setTaskGroups([...taskGroups, newGroup]);
            setGroupForm({ name: "", description: "", color: "gray" });
            setIsCreateGroupModalOpen(false);
        }
    };

    const handleJoinGroup = () => {
        if (joinGroupCode.trim()) {
            // In a real app, this would validate the code on the server
            // For demo purposes, we'll just show success
            setJoinSuccess(true);
            setTimeout(() => {
                setJoinSuccess(false);
                setJoinGroupCode("");
                setIsJoinGroupModalOpen(false);
            }, 2000);
        }
    };

    const copyGroupCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-blue-100 rounded-lg w-full max-w-md mx-auto shadow-xl">
                    <div className="flex justify-between items-center border-b border-blue-200 p-4">
                        <h3 className="text-lg font-medium">{title}</h3>
                        <button onClick={onClose} className="text-gray-600 hover:text-black">
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
                            <NavLink to='/' className="flex items-center space-x-2 text-white cursor-pointer">
                                <Home className="h-5 w-5" />
                                <span>Home</span>
                            </NavLink>
                        </li>

                        <li>
                            <div className="flex items-center justify-between text-white cursor-pointer">
                                <div className="flex items-center space-x-2">
                                    <NavLink to='/task-groups' className="flex items-center space-x-2 text-white cursor-pointer">
                                        <List className="h-5 w-5" />
                                        <span>Task Groups</span>
                                    </NavLink>
                                </div>
                                <div className="flex items-center relative" ref={groupOptionsRef}>
                                    <button
                                        onClick={handleGroupOptions}
                                        className="hover:bg-blue-100 rounded-full p-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>

                                    {isGroupOptionsOpen && (
                                        <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg z-40 w-40">
                                            <ul className="py-5">
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
                                                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue hover:bg-gray-100x"
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

                            <ul className="mt-4 space-y-3 pl-6">
                                {taskGroups.map((group) => (
                                    <li
                                        key={group.id}
                                        className="flex items-center justify-between text-text-gray cursor-pointer hover:text-white"
                                    >
                                        <div
                                            className="flex items-center space-x-2"
                                            onClick={() => handleGroupClick(group.id)}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${colorMap[group.color]}`} />
                                            <span>{group.name}</span>
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveGroupMenu(activeGroupMenu === group.id ? null : group.id);
                                                }}
                                                className="text-gray-700 hover:text-black p-1 rounded-full hover:bg-blue"
                                            >
                                                <MoreVertical size={12} />
                                            </button>

                                            {activeGroupMenu === group.id && (
                                                <div
                                                    className="absolute right-0 top-6 bg-white rounded-md shadow-lg z-40 w-40"
                                                    ref={groupMenuRef}
                                                >
                                                    <ul className="py-1">
                                                        <li>
                                                            <button
                                                                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 text-sm"
                                                                onClick={() => {
                                                                    copyGroupCode(group.inviteCode);
                                                                    setActiveGroupMenu(null);
                                                                }}
                                                            >
                                                                {copySuccess ?
                                                                    <CheckCircle size={14} className="mr-2 text-green-500" /> :
                                                                    <Copy size={14} className="mr-2" />
                                                                }
                                                                Copy Invite Code
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-blue-50"
                                                                onClick={() => handleLeaveGroup(group.id)}
                                                            >
                                                                <UserMinus size={14} className="mr-2" /> Leave Group
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
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
                                    <NavLink
                                        to="/profile"
                                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                                        onClick={() => setProfilePopoverOpen(false)}
                                    >
                                        <User size={14} className="mr-2" /> Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <button
                                        className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-blue-50"
                                        onClick={() => {
                                            console.log("Sign out");
                                            setProfilePopoverOpen(false);
                                        }}
                                    >
                                        <LogOut size={14} className="mr-2" /> Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Create Group Modal */}
            <Modal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                title="Create New Group"
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="groupName" className="block text-sm font-medium mb-1 text-gray-700">
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
                        <label htmlFor="groupDescription" className="block text-sm font-medium mb-1 text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="groupDescription"
                            value={groupForm.description}
                            onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                            placeholder="Enter group description"
                            rows="3"
                            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md w-full"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="groupColor" className="block text-sm font-medium mb-1 text-gray-700">
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

            {/* Join Group Modal */}
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