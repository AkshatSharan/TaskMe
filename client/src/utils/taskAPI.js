import API from '../utils/axios';

export const fetchTasks = () => API.get('/tasks');

export const fetchTaskDetails = (id) => API.get(`/tasks/${id}`);

export const createTask = (taskData) => API.post('/tasks', taskData);

export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const joinTask = (id) => API.post(`/tasks/${id}/join`);

export const fetchTaskGroups = async () => {
    return await API.get('/groups/my-groups');
};

export const createGroup = (groupData) => API.post("/groups", groupData);

export const joinGroupByCode = (code) => API.post(`/groups/join/${code}`);