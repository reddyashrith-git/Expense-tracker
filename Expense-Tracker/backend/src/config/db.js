import mongoose from 'mongoose';

/**
 * Connects to MongoDB using Mongoose.
 * Logs connection status or errors gracefully to prevent crashing
 * in development environments where MongoDB may not yet be running.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    console.warn('[MongoDB] Server is still operational, but database queries will fail until MongoDB is started.');
  }
};

export default connectDB;
