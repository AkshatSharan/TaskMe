import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

API.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.log("Token expired or unauthorized! Logging out...");

            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');

            window.dispatchEvent(new Event('authChanged'));

            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default API;
