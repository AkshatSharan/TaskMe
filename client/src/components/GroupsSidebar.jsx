import React from "react";
import {
  List,
  Plus,
  MoreVertical,
  Copy,
  CheckCircle,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const GroupsSidebar = ({
  taskGroups,
  activeGroupMenu,
  setActiveGroupMenu,
  isGroupOptionsOpen,
  setIsGroupOptionsOpen,
  groupOptionsRef,
  groupMenuRef,
  copySuccess,
  copyGroupCode,
  handleLeaveGroup,
  handleGroupClick,
  setIsCreateGroupModalOpen,
  setIsJoinGroupModalOpen,
  colorMap,
}) => {
  return (
    <li>
      <div className="flex items-center justify-between text-white cursor-pointer">
        <div className="flex items-center space-x-2">
          <NavLink
            to="/task-groups"
            className="flex items-center space-x-2 text-white cursor-pointer"
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
                  setActiveGroupMenu(
                    activeGroupMenu === group.id ? null : group.id
                  );
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
  );
};

export default GroupsSidebar;