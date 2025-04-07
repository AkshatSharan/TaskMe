import React from "react";
import { User, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TaskGroups = () => {
    const navigate = useNavigate();

    const groups = [
        {
            id: 1,
            name: "Design Team",
            description: "UI/UX design projects and collaboration",
            members: 8,
            color: "blue",
        },
        {
            id: 2,
            name: "Development Team",
            description: "Frontend and backend development coordination",
            members: 12,
            color: "purple",
        },
        {
            id: 3,
            name: "QA Team",
            description: "Quality assurance and testing procedures",
            members: 6,
            color: "green",
        },
        {
            id: 4,
            name: "Product Team",
            description: "Product strategy and roadmap planning",
            members: 5,
            color: "amber",
        },
    ];

    const handleGroupClick = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

    const getBorderColor = (color) => {
        switch (color) {
            case "blue":
                return "border-blue-500";
            case "purple":
                return "border-purple-500";
            case "green":
                return "border-green-500";
            case "amber":
                return "border-amber-500";
            default:
                return "border-gray-500";
        }
    };

    const getDotColor = (color) => {
        switch (color) {
            case "blue":
                return "text-blue-500";
            case "purple":
                return "text-purple-500";
            case "green":
                return "text-green-500";
            case "amber":
                return "text-amber-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="min-h-screen bg-blue-300 text-white sm:p-12 p-8">
            <main className="md:ml-56">
                <h1 className="text-2xl font-bold mb-6">Task Groups</h1>
                <div className="space-y-4">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className={`bg-gray-800 rounded-lg p-6 border-l-4 cursor-pointer  ${getBorderColor(
                                group.color
                            )} hover:bg-gray-700 transition-colors`}
                            onClick={() => handleGroupClick(group.id)}
                        >
                            <div className="flex justify-between items-start space-y-2">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="text-lg font-semibold">{group.name}</h3>
                                        <span className={`ml-2 text-2xl ${getDotColor(group.color)}`}>•</span>
                                    </div>
                                    <p className="text-gray-400 mt-1">{group.description}</p>
                                    <div className="flex items-center mt-2 text-sm text-gray-400">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{group.members} members</span>
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