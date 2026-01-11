import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

function Home() {
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/products/trending`),
      ]);

      if (categoriesRes.data.success) {
        const catPayload = categoriesRes.data?.data?.categories ?? categoriesRes.data?.data ?? [];
        setCategories(Array.isArray(catPayload) ? catPayload : []);
      }
      if (productsRes.data.success) {
        const prodPayload = productsRes.data?.data?.products ?? productsRes.data?.data ?? [];
        setTrendingProducts(Array.isArray(prodPayload) ? prodPayload : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCategories([]);
      setTrendingProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(productId) {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.message);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">E-Commerce Store</h1>
          <nav className="flex gap-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600">Shop</Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600">Cart</Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                ) : (
                  <>
                    <Link to="/orders" className="text-gray-700 hover:text-blue-600">Orders</Link>
                    <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/signup" className="text-gray-700 hover:text-blue-600">Signup</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-12 lg:py-16 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="inline-block px-3 py-1 bg-white/15 rounded-full text-sm">New season arrivals</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Shop the latest products at beginner-friendly prices
            </h2>
            <p className="text-white/90 text-lg">
              Discover curated categories, trending picks, and easy cash-on-delivery checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:-translate-y-0.5 transition"
              >
                Start Shopping
              </Link>
              {isAuthenticated ? (
                <Link
                  to={user?.role === 'admin' ? '/dashboard' : '/orders'}
                  className="px-6 py-3 border border-white/70 text-white font-semibold rounded-lg hover:bg-white/10 transition"
                >
                  {user?.role === 'admin' ? 'Go to Dashboard' : 'My Orders'}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-3 border border-white/70 text-white font-semibold rounded-lg hover:bg-white/10 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="bg-white text-gray-800 rounded-xl shadow-xl p-6 grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Trending now</p>
                <p className="text-2xl font-bold">Up to 40% off</p>
              </div>
              <span className="text-4xl">🛍️</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Fast COD checkout</p>
              <p className="text-lg font-semibold">Cash on Delivery available</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-blue-700 font-semibold">Secure</p>
                <p className="text-gray-600">Protected payments</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-green-700 font-semibold">Fast</p>
                <p className="text-gray-600">Quick delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
          <Link to="/shop" className="text-blue-600 hover:text-blue-700 font-semibold">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/shop?category=${category.name}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border border-gray-100"
            >
              <div className="text-4xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
        {(!categories || categories.length === 0) && (
          <p className="text-gray-500 text-center mt-6">No categories available yet.</p>
        )}
      </section>

      {/* Trending Products Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Trending Products</h2>
            <Link to="/shop" className="text-blue-600 hover:text-blue-700 font-semibold">Browse shop</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <div key={product._id} className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">${product.price}</p>
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
          </div>
          {trendingProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No trending products available</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">E-Commerce Store</h3>
            <p className="text-gray-400">Simple COD shopping with a clean dashboard to manage products and orders.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shop" className="hover:text-white">All Products</Link></li>
              <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Admin</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Products & Categories</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Orders & Users</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Cash on Delivery</li>
              <li>Easy returns</li>
              <li>Fast shipping</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 text-center py-4 text-gray-500 text-sm">
          © {new Date().getFullYear()} E-Commerce Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;

