import React, { useEffect, useState } from "react";
import { Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchTasks } from "../utils/taskAPI"; // make sure this is set up properly

const TaskGroups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);

    const colors = ["blue", "purple", "green", "amber"];

    const getBorderColor = (color) => {
        return `border-${color}-500`;
    };

    const getDotColor = (color) => {
        return `text-${color}-500`;
    };

    const handleGroupClick = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const res = await fetchTasks();
                const tasksWithColors = res.data.map((group, index) => ({
                    ...group,
                    color: colors[index % colors.length],
                }));
                setGroups(tasksWithColors);
            } catch (err) {
                console.error("Failed to load task groups:", err);
            }
        };
        loadGroups();
    }, []);

    return (
        <div className="min-h-screen bg-blue-300 text-white sm:p-12 p-8">
            <main className="md:ml-56">
                <h1 className="text-2xl font-bold mb-6">Task Groups</h1>
                <div className="space-y-4">
                    {groups.map((group) => (
                        <div
                            key={group._id}
                            className={`bg-gray-800 rounded-lg p-6 border-l-4 cursor-pointer ${getBorderColor(group.color)} hover:bg-gray-700 transition-colors`}
                            onClick={() => handleGroupClick(group._id)}
                        >
                            <div className="flex justify-between items-start space-y-2">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="text-lg font-semibold">{group.title}</h3>
                                        <span className={`ml-2 text-2xl ${getDotColor(group.color)}`}>•</span>
                                    </div>
                                    <p className="text-gray-400 mt-1">{group.description}</p>
                                    <div className="flex items-center mt-2 text-sm text-gray-400">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{group.members || (group.users?.length || 0)} members</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TaskGroups;
