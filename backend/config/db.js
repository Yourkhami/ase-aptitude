const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ase_aptitude', {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected.');
    });

    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Tip: Ensure MongoDB is running locally or set MONGODB_URI in backend/.env to your MongoDB Atlas connection string.');
    // In dev mode, do not hard exit so server can still serve static files and provide meaningful diagnostics
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
