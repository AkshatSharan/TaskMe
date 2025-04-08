import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, formData);

            if (res.data.success) {
                navigate('/login');
            } else {
                setError(res.data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-blue-200 center-page items-middle flex-col px-7 py-10 rounded-lg max-sm:w-[80vw] w-[400px]'>
            <h1 className='text-2xl font-bold min-md:text-3xl'>Welcome to TaskMe!</h1>
            <p className='text-xs mt-3'>Create a new account</p>

            <form className='flex flex-col w-full mt-6 gap-5 text-sm' onSubmit={handleSubmit}>
                <label className='flex flex-col gap-2'>
                    Name
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Enter your name'
                        className='input-box text-md'
                        required
                    />
                </label>
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
                        placeholder='Create a password'
                        className='input-box text-md'
                        required
                    />
                </label>

                {error && <p className='text-red-600 text-xs'>{error}</p>}

                <input
                    type='submit'
                    value={loading ? 'Signing Up...' : 'Sign Up'}
                    className='site-button cursor-pointer'
                    disabled={loading}
                />

                <div className='flex gap-1'>
                    <p>Already have an account?</p>
                    <NavLink to='/login'>
                        <p className='text-gray-400 underline cursor-pointer'>Login</p>
                    </NavLink>
                </div>
            </form>
        </div>
    );
};

export default Signup;
