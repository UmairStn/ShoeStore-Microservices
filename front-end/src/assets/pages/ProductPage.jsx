import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Please login first');
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:8081/ead/api/products')
            .then(response => {
                setProducts(response.data);
                console.log('Products loaded:', response.data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setMessage("Failed to load products. Make sure the Product Service is running on port 8081.");
            });
    }, []);

    const handleBuy = async (productId, price, currentInventory) => {
        if (!user || !user.id) {
            alert('User not logged in');
            navigate('/login');
            return;
        }

        // Check if inventory is available
        if (currentInventory <= 0) {
            setMessage("❌ Product is out of stock.");
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            // Step 1: Create the order
            const orderData = {
                userId: user.id,
                items: [
                    {
                        productId: productId,
                        quantity: 1,
                        price: price
                    }
                ]
            };

            const orderResponse = await axios.post('http://localhost:8082/ead/api/orders', orderData);
            
            // Step 2: Update product inventory (deduct 1)
            const updatedInventory = currentInventory - 1;
            await axios.patch(`http://localhost:8081/ead/api/products/${productId}`, {
                inventoryCount: updatedInventory
            });

            setMessage(`✅ Order Placed Successfully! Order #${orderResponse.data.orderNumber}`);
            
            // Refresh products to show updated inventory
            const productsResponse = await axios.get('http://localhost:8081/ead/api/products');
            setProducts(productsResponse.data);
            
            setTimeout(() => setMessage(''), 5000);
            alert(`Order Placed Successfully! Order`);
        } catch (error) {
            console.error("Error placing order:", error);
            setMessage("❌ Failed to place order.");
            setTimeout(() => setMessage(''), 3000);
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
                                    <span className="text-2xl">👟</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Shoe Store
                                </h1>
                            </div>
                            <div className="hidden md:flex space-x-1">
                                <button 
                                    onClick={() => navigate('/products')}
                                    className="px-4 py-2 text-white font-semibold bg-slate-900 rounded-lg"
                                >
                                    Products
                                </button>
                                <button 
                                    onClick={() => navigate('/orders')}
                                    className="px-4 py-2 text-gray-700 hover:text-slate-900 hover:bg-gray-100 font-semibold rounded-lg transition"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
                {/* Welcome Banner */}
                <div className="bg-slate-900 rounded-2xl shadow-xl p-8 mb-12 text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-3">
                        Welcome back, {user?.firstName}!
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300">
                        Discover premium footwear designed for comfort and style
                    </p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`mb-8 p-4 rounded-xl ${message.includes('Failed') || message.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'} shadow-lg`}>
                        <p className="font-semibold text-center">{message}</p>
                    </div>
                )}

                {/* Products Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-3xl font-bold text-gray-900">
                            Featured Collection
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm font-medium">{products.length} Products</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.length > 0 ? (
                            products.map(product => (
                                <div key={product.id} className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200">
                                    {/* Product Image */}
                                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                        {product.image ? (
                                            <img 
                                                src={product.image} 
                                                alt={product.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-7xl transform group-hover:scale-110 transition-transform duration-300">👟</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            {product.isAvailable !== false ? (
                                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Product Details */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                            {product.description}
                                        </p>
                                        
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Price</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${product.price}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 mb-1">Available</p>
                                                <p className="text-lg font-semibold text-gray-700">
                                                    {product.inventoryCount ?? product.stock ?? 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleBuy(product.id, product.price, product.inventoryCount)}
                                            disabled={product.isAvailable === false || product.inventoryCount === 0}
                                            className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                                                product.isAvailable === false || product.inventoryCount === 0
                                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                                    : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xl transform hover:scale-105'
                                            }`}
                                        >
                                            <span>🛒</span>
                                            <span>{product.isAvailable === false || product.inventoryCount === 0 ? 'Out of Stock' : 'Buy Now'}</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <div className="text-6xl mb-4">📦</div>
                                <p className="text-gray-500 text-xl">No products available at the moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-xl">👟</span>
                            </div>
                            <h3 className="text-2xl font-bold">Shoe Store</h3>
                        </div>
                        <p className="text-gray-400 mb-2">Premium Footwear for Every Occasion</p>
                        <p className="text-sm text-gray-500">&copy; 2025 Shoe Store. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ProductPage;