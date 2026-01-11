import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// Middleware to check if user is admin
export function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.',
    });
  }
}

// Get dashboard stats
// GET /api/admin/stats
export async function getDashboardStats(req, res) {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue,
        pendingOrders,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
}

// Get all orders (admin)
// GET /api/admin/orders
export async function getAllOrders(req, res) {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('user', 'name email username')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limitNum);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalOrders,
          itemsPerPage: limitNum,
        },
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
}

// Update order status (admin)
// PUT /api/admin/orders/:id
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
}

// Get all users (admin)
// GET /api/admin/users
export async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limitNum);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalUsers,
          itemsPerPage: limitNum,
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: 'SERVER_ERROR',
    });
  }
}


