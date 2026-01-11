import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [isAuthenticated, navigate]);

  async function fetchUserProfile() {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: getHeaders(),
      });
      
      if (response.data.success) {
        setUser(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        formData,
        { headers: getHeaders() }
      );
      
      if (response.data.success) {
        setUser(response.data.data);
        setEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

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
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">E-Commerce Store</Link>
          <nav className="flex gap-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600">Shop</Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600">Cart</Link>
            <Link to="/orders" className="text-gray-700 hover:text-blue-600">Orders</Link>
            <Link to="/profile" className="text-blue-600 font-semibold">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

          {user && (
            <div className="bg-white rounded-lg shadow-md p-8">
              {!editing ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Name</label>
                    <p className="text-lg text-gray-800 mt-1">{user.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-lg text-gray-800 mt-1">{user.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Username</label>
                    <p className="text-lg text-gray-800 mt-1">{user.username}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Member Since</label>
                    <p className="text-lg text-gray-800 mt-1">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
                    >
                      Edit Profile
                    </button>
                    <Link
                      to="/orders"
                      className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition font-semibold text-center"
                    >
                      View Orders
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData(user);
                      }}
                      className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 mt-8">
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
            <h4 className="text-lg font-semibold text-white mb-2">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
              <li><button onClick={handleLogout} className="hover:text-white text-left">Logout</button></li>
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

export default Profile;
