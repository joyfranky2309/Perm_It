const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./model/user.model');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const adminPassword = process.env.ADMIN_PASSWORD ;
    const admin = new User({
      name: process.env.ADMIN_NAME ,
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash(adminPassword, 12),
      role: 'admin',
      status: 'active',
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed script failed:', error);
    process.exit(1);
  }
};

seedAdmin();
