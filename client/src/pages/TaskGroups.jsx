import React, { useEffect, useState, useCallback } from "react";
import { Users, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchTaskGroups } from "../utils/taskAPI";
import { colorMap } from "../components/colorMap";

const TaskGroups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleGroupClick = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

    const loadGroups = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchTaskGroups();
            const tasksWithColors = res.data.map((group) => ({
                ...group,
            }));
            setGroups(tasksWithColors);
        } catch (err) {
            console.error("Failed to load task groups:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGroups();

        window.addEventListener("groupRefresh", loadGroups);

        return () => {
            window.removeEventListener("groupRefresh", loadGroups);
        };
    }, [loadGroups]);

    return (
        <div className="min-h-screen bg-blue-300 text-white sm:p-12 p-8">
            <main className="md:ml-56">
                <h1 className="text-2xl font-bold mb-6">Task Groups</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin w-6 h-6 text-white" />
                        <span className="ml-2 text-sm">Loading groups...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {groups.length === 0 ? (
                            <p className="text-white text-center text-sm">No groups joined yet.</p>
                        ) : (
                            groups.map((group) => (
                                <div
                                    key={group._id}
                                    className={`bg-gray-800 rounded-lg p-6 border-l-4 cursor-pointer ${colorMap[group.color]?.border} hover:bg-gray-700 transition-colors`}
                                    onClick={() => handleGroupClick(group._id)}
                                >
                                    {console.log(colorMap[group.color])}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center">
                                                <h3 className="text-lg font-semibold">{group.name}</h3>
                                                <span className={`ml-2 w-2 h-2 rounded-full ${colorMap[group.color]?.bg}`}></span>
                                            </div>
                                            {group.description && (
                                                <p className="text-gray-400 mt-1">{group.description}</p>
                                            )}
                                            <div className="flex items-center mt-2 text-sm text-gray-400">
                                                <Users className="h-4 w-4 mr-1" />
                                                <span>{group.members?.length || 0} members</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-500" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TaskGroups;