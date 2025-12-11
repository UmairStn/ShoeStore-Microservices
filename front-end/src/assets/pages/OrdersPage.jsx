import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Please login first');
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchOrders(parsedUser.id);
        }
    }, [navigate]);

    const fetchOrders = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8082/ead/api/orders/user/${userId}`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setMessage("Failed to load orders.");
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'PLACED':
                return 'bg-blue-100 text-blue-800';
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">👟</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Shoe Store
                                </h1>
                            </div>
                            <div className="hidden md:flex space-x-1">
                                <button 
                                    onClick={() => navigate('/products')}
                                    className="px-4 py-2 text-gray-700 hover:text-slate-900 hover:bg-gray-100 font-semibold rounded-lg transition"
                                >
                                    Products
                                </button>
                                <button 
                                    onClick={() => navigate('/orders')}
                                    className="px-4 py-2 text-white font-semibold bg-slate-900 rounded-lg"
                                >
                                    My Orders
                                </button>
                            </div>
                        </div>
                        
                        {user && (
                            <div className="flex items-center space-x-4">
                                <div className="hidden md:flex items-center space-x-3 bg-gray-100 rounded-xl px-4 py-2">
                                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold shadow">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-600">{user.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order History</h2>
                    <p className="text-gray-600">Track and manage your purchases</p>
                </div>

                {/* Error Message */}
                {message && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                        <p className="font-semibold text-center">{message}</p>
                    </div>
                )}

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
                        <h3 className="text-xl font-bold">My Orders</h3>
                        <span className="bg-white text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                            {orders.length} Orders
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 mb-3"></div>
                            <p className="text-gray-600">Loading orders...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Order Number
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xl">📦</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            #{order.orderNumber}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ID: {order.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-900">
                                                    {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-lg font-bold text-gray-900">
                                                    ${order.totalAmount?.toFixed(2) || '0.00'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status || 'PENDING'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
                            <button 
                                onClick={() => navigate('/products')}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Browse Products
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-base">👟</span>
                            </div>
                            <h3 className="text-xl font-bold">Shoe Store</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">Premium Footwear for Every Occasion</p>
                        <p className="text-xs text-gray-500">&copy; 2025 Shoe Store. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OrdersPage;