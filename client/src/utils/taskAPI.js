import API from '../utils/axios';

export const getTasks = (id) => API.get(`/tasks/user/${id}`);

export const createTask = (taskData) => API.post("/tasks", taskData);

export const updateTask = (taskId, updatedFields) => API.put(`/tasks/${taskId}`, updatedFields);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const fetchTaskGroups = async () => {
    return await API.get('/groups/my-groups');
};

export const createGroup = (groupData) => API.post("/groups", groupData);

export const joinGroupByCode = (code) => API.post(`/groups/join/${code}`);

export const getGroupById = (id) => API.get(`/groups/${id}`);

export const joinRequest = (groupId, requestId, action) => API.post(`/groups/${groupId}/requests/${requestId}`, action);