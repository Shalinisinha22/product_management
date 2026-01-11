import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

async function updateAdminRole() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/productmanagement';
    
    if (!mongoUri) {
      console.error('❌ Error: MONGODB_URI is required in .env file');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Update admin user role
    const result = await User.updateOne(
      { username: 'admin' },
      { role: 'admin' }
    );

    if (result.matchedCount === 0) {
      console.log('⚠️  Admin user not found!');
      process.exit(0);
    }

    if (result.modifiedCount === 1) {
      console.log('✅ Admin user role updated successfully!');
    } else {
      console.log('ℹ️  Admin user already has admin role');
    }

    // Verify the update
    const adminUser = await User.findOne({ username: 'admin' });
    console.log('📝 Updated Admin User:');
    console.log('   Username:', adminUser.username);
    console.log('   Role:', adminUser.role);
    console.log('   Email:', adminUser.email);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin role:', error);
    process.exit(1);
  }
}

updateAdminRole();
