import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default API;
