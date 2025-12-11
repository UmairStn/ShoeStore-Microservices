import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        inventoryCount: '',
        isAvailable: true,
        image: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Please login first');
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/ead/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setMessage('Failed to load products');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                id: parseInt(formData.id),
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                inventoryCount: parseInt(formData.inventoryCount),
                isAvailable: formData.isAvailable,
                image: formData.image
            };

            await axios.post('http://localhost:8081/ead/api/products', productData);
            setMessage('✅ Product added successfully!');
            setFormData({
                id: '',
                name: '',
                description: '',
                price: '',
                inventoryCount: '',
                isAvailable: true,
                image: ''
            });
            setShowAddForm(false);
            fetchProducts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage('❌ Failed to add product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            inventoryCount: product.inventoryCount,
            isAvailable: product.isAvailable,
            image: product.image || ''
        });
        setShowEditForm(true);
        setShowAddForm(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                inventoryCount: parseInt(formData.inventoryCount),
                isAvailable: formData.isAvailable,
                image: formData.image
            };

            await axios.put(`http://localhost:8081/ead/api/products/${editingProduct.id}`, productData);
            setMessage('✅ Product updated successfully!');
            setFormData({
                id: '',
                name: '',
                description: '',
                price: '',
                inventoryCount: '',
                isAvailable: true,
                image: ''
            });
            setShowEditForm(false);
            setEditingProduct(null);
            fetchProducts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating product:', error);
            setMessage('❌ Failed to update product');
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditingProduct(null);
        setFormData({
            id: '',
            name: '',
            description: '',
            price: '',
            inventoryCount: '',
            isAvailable: true,
            image: ''
        });
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:8081/ead/api/products/${productId}`);
                setMessage('✅ Product deleted successfully!');
                fetchProducts();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('Error deleting product:', error);
                setMessage('❌ Failed to delete product');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
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
                                    className="px-4 py-2 text-white font-semibold bg-slate-900 rounded-lg"
                                >
                                    Products
                                </button>
                                <button 
                                    onClick={() => navigate('/admin/orders')}
                                    className="px-4 py-2 text-black font-semibold rounded-lg"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h2>
                        <p className="text-gray-600">Add, edit, and manage your product inventory</p>
                    </div>
                    {!showEditForm && (
                        <button
                            onClick={() => {
                                setShowAddForm(!showAddForm);
                                if (showAddForm) {
                                    setFormData({
                                        id: '',
                                        name: '',
                                        description: '',
                                        price: '',
                                        inventoryCount: '',
                                        isAvailable: true,
                                        image: ''
                                    });
                                }
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center space-x-3 whitespace-nowrap"
                        >
                            <span className="text-xl">{showAddForm ? '✕' : '+'}</span>
                            <span>{showAddForm ? 'Cancel' : 'Add Product'}</span>
                        </button>
                    )}
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.includes('Failed') || message.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'} shadow-lg`}>
                        <p className="font-semibold text-center">{message}</p>
                    </div>
                )}

                {/* Edit Product Form */}
                {showEditForm && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Edit Product #{editingProduct.id}</h3>
                            <button
                                onClick={handleCancelEdit}
                                className="text-gray-500 hover:text-gray-700 font-semibold"
                            >
                                ✕ Close
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product ID
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.id}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g., Nike Air Max 270"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="99.99"
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Inventory Count *
                                    </label>
                                    <input
                                        type="number"
                                        name="inventoryCount"
                                        value={formData.inventoryCount}
                                        onChange={handleChange}
                                        placeholder="100"
                                        min="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description..."
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={formData.isAvailable}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
                                />
                                <label className="text-sm font-semibold text-gray-700">
                                    Product is available for purchase
                                </label>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                                >
                                    Update Product
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Add Product Form */}
                {showAddForm && !showEditForm && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product ID *
                                    </label>
                                    <input
                                        type="number"
                                        name="id"
                                        value={formData.id}
                                        onChange={handleChange}
                                        placeholder="e.g., 1"
                                        min="1"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g., Nike Air Max 270"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="99.99"
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Inventory Count *
                                    </label>
                                    <input
                                        type="number"
                                        name="inventoryCount"
                                        value={formData.inventoryCount}
                                        onChange={handleChange}
                                        placeholder="100"
                                        min="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description..."
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={formData.isAvailable}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
                                />
                                <label className="text-sm font-semibold text-gray-700">
                                    Product is available for purchase
                                </label>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                                >
                                    Add Product
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
                        <h3 className="text-xl font-bold">All Products</h3>
                        <span className="bg-white text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                            {products.length} Items
                        </span>
                    </div>

                    {products.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">#{product.id}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                        {product.image ? (
                                                            <img 
                                                                src={product.image} 
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.parentElement.innerHTML = '<span class="text-3xl flex items-center justify-center h-full">👟</span>';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="text-3xl">👟</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{product.name}</p>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-lg font-bold text-gray-900">${product.price}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{product.inventoryCount}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.isAvailable !== false && product.inventoryCount > 0 ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                        Unavailable
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-800 font-semibold text-sm transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <p className="text-gray-500 text-lg">No products found</p>
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

export default Admin;