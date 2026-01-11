import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  async function fetchCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        const catPayload = response.data?.data?.categories ?? response.data?.data ?? [];
        setCategories(Array.isArray(catPayload) ? catPayload : []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? `${API_URL}/products?limit=50`
        : `${API_URL}/products?category=${selectedCategory}&limit=50`;
      
      const response = await axios.get(url);
      if (response.data.success) {
        const prodPayload = response.data?.data?.products ?? response.data?.data ?? [];
        setProducts(Array.isArray(prodPayload) ? prodPayload : []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">E-Commerce Store</Link>
          <nav className="flex gap-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600 font-semibold">Shop</Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600">Cart</Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/signup" className="text-gray-700 hover:text-blue-600">Signup</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Shop</h1>

        {/* Category Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
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
                  <p className="text-sm text-gray-500 mb-3">
                    Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    className={`w-full py-2 rounded transition-colors ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;

