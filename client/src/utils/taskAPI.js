import API from '../utils/axios';

export const fetchTasks = () => API.get('/tasks');

export const fetchTaskDetails = (id) => API.get(`/tasks/${id}`);

export const createTask = (taskData) => API.post('/tasks', taskData);

export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const joinTask = (id) => API.post(`/tasks/${id}/join`);
