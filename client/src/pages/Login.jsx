import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;

                if (decoded.exp > now) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    navigate('/');
                } else {
                    localStorage.clear();
                }
            } catch (err) {
                console.error('Invalid token:', err);
                localStorage.clear();
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log(formData);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
                formData,
                { withCredentials: true }
            );

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(res.data.user));

                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                navigate('/');
            } else {
                setError(res.data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-blue-200 center-page items-middle flex-col px-7 py-10 rounded-lg max-sm:w-[80vw] w-[400px]'>
            <h1 className='text-2xl font-bold min-md:text-3xl'>Welcome Back</h1>
            <p className='text-xs mt-3'>Sign in to your account</p>

            <form className='flex flex-col w-full mt-6 gap-5 text-sm' onSubmit={handleSubmit}>
                <label className='flex flex-col gap-2'>
                    Email
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Enter email'
                        className='input-box text-md'
                        required
                    />
                </label>
                <label className='flex flex-col gap-2'>
                    Password
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Enter password'
                        className='input-box text-md'
                        required
                    />
                </label>

                {error && <p className='text-red-600 text-xs'>{error}</p>}

                <p className='text-gray-400 text-xs cursor-pointer'>Forgot password?</p>

                <input
                    type='submit'
                    value={loading ? 'Signing In...' : 'Sign In'}
                    className='site-button cursor-pointer'
                    disabled={loading}
                />

                <div className='flex gap-1'>
                    <p>Don't have an account?</p>
                    <NavLink to='/signup'>
                        <p className='text-gray-400 underline cursor-pointer'>Sign up</p>
                    </NavLink>
                </div>
            </form>
        </div>
    );
};

export default Login;
