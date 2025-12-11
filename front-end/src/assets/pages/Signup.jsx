import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        
        try {
            const response = await axios.post('http://localhost:8080/ead/auth/signup', formData);
            
            alert('Signup successful!');
            console.log('Response:', response.data);
            setFormData({
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: ''
            });
            navigate('/login');
        } catch (error) {
            console.error('Full Error:', error);
            console.error('Error Response:', error.response?.data);
            
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.message || 
                                error.response?.data || 
                                'Signup failed.';
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 mb-4 shadow-lg">
                            <span className="text-3xl">🛍️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600">Join us today</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Choose username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg shadow-lg transform transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 mt-6"
                            type="submit"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-600">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg border-2 border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                        Sign In Instead
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    © 2025 Shoe Store. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default Signup;