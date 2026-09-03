const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('No MONGODB_URI provided in environment variables.');
    console.log('Running with built-in zero-downtime memory store.');
    console.log('Tip: For permanent cloud storage, add MONGODB_URI in Render Environment Variables.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
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
    console.warn('Running with built-in memory store so the website and admin panel stay online without downtime.');
    return null;
  }
};

module.exports = connectDB;
