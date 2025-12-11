import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Hardcoded admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login Data:', formData);
        
        // Check if it's admin login
        if (isAdminLogin) {
            // Validate admin credentials
            if (formData.username === ADMIN_USERNAME && formData.password === ADMIN_PASSWORD) {
                alert('Admin login successful!');
                
                // Store admin user data
                const adminUser = {
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@shoestore.com',
                    username: 'admin'
                };
                
                localStorage.setItem('user', JSON.stringify(adminUser));
                localStorage.setItem('token', 'admin-token');
                
                setFormData({
                    username: '',
                    password: ''
                });
                
                navigate('/admin');
            } else {
                alert('Invalid admin credentials! Please check username and password.');
            }
        } else {
            // Regular user login
            try {
                const response = await axios.post('http://localhost:8080/ead/auth/login', formData);
                
                alert('Login successful!');
                console.log('Response:', response.data);
                
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                
                setFormData({
                    username: '',
                    password: ''
                });
                
                navigate('/products');
            } catch (error) {
                console.error('Error:', error);
                alert(error.response?.data || 'Login failed. Invalid credentials.');
            }
        }
    };

    const toggleLoginType = () => {
        setIsAdminLogin(!isAdminLogin);
        setFormData({
            username: '',
            password: ''
        });
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="relative w-full max-w-md px-6">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg transition-colors ${
                            isAdminLogin ? 'bg-slate-900' : 'bg-slate-900'
                        }`}>
                            <span className="text-3xl">{isAdminLogin ? '⚙️' : '👟'}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-600">
                            {isAdminLogin ? 'Sign in to admin panel' : 'Sign in to your account'}
                        </p>
                    </div>

                    {/* Login Type Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setIsAdminLogin(false)}
                            className={`flex-1 py-2 rounded-md font-semibold text-sm transition ${
                                !isAdminLogin 
                                    ? 'bg-white text-gray-900 shadow' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            👤 User
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdminLogin(true)}
                            className={`flex-1 py-2 rounded-md font-semibold text-sm transition ${
                                isAdminLogin 
                                    ? 'bg-white text-gray-900 shadow' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            🔐 Admin
                        </button>
                    </div>

                    {/* Admin Credentials Info (only shown for admin login) */}
                    {isAdminLogin && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-800 text-center">
                                <span className="font-semibold">Demo Credentials:</span> admin / admin123
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                id="username"
                                name="username"
                                type="text"
                                placeholder={isAdminLogin ? "Enter admin username" : "Enter your username"}
                                value={formData.username}
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
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            className={`w-full font-semibold py-3 rounded-lg shadow-lg transform transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                isAdminLogin
                                    ? 'bg-slate-900 hover:bg-blue-700 text-white focus:ring-slate-900'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-900'
                            }`}
                            type="submit"
                        >
                            {isAdminLogin ? 'Sign In as Admin' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider - Only show for user login */}
                    {!isAdminLogin && (
                        <>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-600">Don't have an account?</span>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg border-2 border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-slate-900"
                            >
                                Create New Account
                            </button>
                        </>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    © 2025 Shoe Store. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default Login;