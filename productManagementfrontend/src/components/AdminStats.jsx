import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: getHeaders(),
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      alert('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-xl">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Statistics</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
          <div className="text-gray-600 mt-2">Total Users</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-green-600">{stats.totalProducts}</div>
          <div className="text-gray-600 mt-2">Total Products</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-purple-600">{stats.totalOrders}</div>
          <div className="text-gray-600 mt-2">Total Orders</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-orange-600">${stats.totalRevenue.toFixed(2)}</div>
          <div className="text-gray-600 mt-2">Total Revenue</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          <div className="text-gray-600 mt-2">Pending Orders</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalCategories}</div>
          <div className="text-gray-600 mt-2">Total Categories</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
        {stats.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-2">#{order._id.slice(-6)}</td>
                    <td className="py-2">{order.user?.name || 'N/A'}</td>
                    <td className="py-2">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent orders</p>
        )}
      </div>
    </div>
  );
}

export default AdminStats;


