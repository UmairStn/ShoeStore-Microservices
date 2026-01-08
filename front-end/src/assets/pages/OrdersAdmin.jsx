import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrdersAdmin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Please login first');
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Fetch all orders
            const ordersResponse = await axios.get('http://localhost:8082/ead/api/orders');
            const ordersData = ordersResponse.data;

            // Fetch all users
            const usersResponse = await axios.get('http://localhost:8080/ead/api/users');
            const usersData = usersResponse.data;

            // Fetch all products
            const productsResponse = await axios.get('http://localhost:8081/ead/api/products');
            const productsData = productsResponse.data;

            // Create lookup maps
            const userMap = {};
            usersData.forEach(user => {
                userMap[user.id] = user;
            });

            const productMap = {};
            productsData.forEach(product => {
                productMap[product.id] = product;
            });

            // Enrich orders with user and product details
            const enrichedOrders = [];
            
            ordersData.forEach(order => {
                const customer = userMap[order.userId] || {};
                
                // Check if items exist and is an array
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        const product = productMap[item.productId] || {};
                        
                        enrichedOrders.push({
                            orderId: order.id,
                            orderNumber: order.orderNumber,
                            customerId: order.userId,
                            customerName: `${customer.firstName || 'N/A'} ${customer.lastName || ''}`.trim(),
                            customerEmail: customer.email || 'N/A',
                            productId: item.productId,
                            productName: product.name || 'Unknown Product',
                            productImage: product.image || '',
                            quantity: item.quantity,
                            price: item.price,
                            totalAmount: order.totalAmount,
                            status: order.status,
                            createdAt: order.createdAt
                        });
                    });
                } else {
                    // If no items, still show the order
                    enrichedOrders.push({
                        orderId: order.id,
                        orderNumber: order.orderNumber,
                        customerId: order.userId,
                        customerName: `${customer.firstName || 'N/A'} ${customer.lastName || ''}`.trim(),
                        customerEmail: customer.email || 'N/A',
                        productId: 'N/A',
                        productName: 'No items',
                        productImage: '',
                        quantity: 0,
                        price: 0,
                        totalAmount: order.totalAmount,
                        status: order.status,
                        createdAt: order.createdAt
                    });
                }
            });

            setOrders(enrichedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setMessage('❌ Failed to load orders');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:8082/ead/api/orders/${orderId}`, {
                status: newStatus
            });
            setMessage(`✅ Order status updated to ${newStatus}`);
            fetchOrders();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating order status:', error);
            setMessage('❌ Failed to update order status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                                    <span className="text-2xl">⚙️</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Admin Panel
                                </h1>
                            </div>
                            <div className="hidden md:flex space-x-1">
                                <button 
                                    onClick={() => navigate('/admin')}
                                    className="px-4 py-2 text-gray-700 hover:text-slate-900 hover:bg-gray-100 font-semibold rounded-lg transition"
                                >
                                    Products
                                </button>
                                <button 
                                    onClick={() => navigate('/admin/orders')}
                                    className="px-4 py-2 text-white font-semibold bg-slate-900 rounded-lg"
                                >
                                    Orders
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
                                        <p className="text-xs text-gray-600">Admin</p>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h2>
                        <p className="text-gray-600">View and manage all customer orders</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center space-x-2"
                    >
                        <span>🔄</span>
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.includes('Failed') || message.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'} shadow-lg`}>
                        <p className="font-semibold text-center">{message}</p>
                    </div>
                )}

                {/* Orders List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
                        <h3 className="text-xl font-bold">All Orders</h3>
                        <span className="bg-white text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                            {orders.length} Items
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">⏳</div>
                            <p className="text-gray-500 text-lg">Loading orders...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Order Info
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order, index) => (
                                        <tr key={`${order.orderId}-${order.productId}-${index}`} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                                                    <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.customerName}</p>
                                                    <p className="text-sm text-gray-500">ID: {order.customerId}</p>
                                                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                        {order.productImage ? (
                                                            <img 
                                                                src={order.productImage} 
                                                                alt={order.productName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.parentElement.innerHTML = '<span class="text-2xl flex items-center justify-center h-full">👟</span>';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="text-2xl">👟</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{order.productName}</p>
                                                        <p className="text-xs text-gray-500">ID: {order.productId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{order.quantity}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">
                                                    ${(order.price || 0).toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                                                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                                >
                                                    <option value="PLACED">Placed</option>
                                                    <option value="PROCESSING">Processing</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <p className="text-gray-500 text-lg">No orders found</p>
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
                                <span className="text-base">⚙️</span>
                            </div>
                            <h3 className="text-xl font-bold">Admin Panel</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">Manage Your Store Efficiently</p>
                        <p className="text-xs text-gray-500">&copy; 2025 Shoe Store. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OrdersAdmin;
