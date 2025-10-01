require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Ibrahim-Alaya-Exam:Tush1083@todo-app.q9f09dh.mongodb.net/?retryWrites=true&w=majority&appName=Todo-App', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('⚠️  Starting server without database connection...');
  }
};

// Start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Blog API Server...');
    
    // Connect to database
    await connectDB();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log('📚 API Endpoints:');
      console.log(`   GET  http://localhost:${PORT}/ - API info`);
      console.log(`   POST http://localhost:${PORT}/api/auth/signup - Register`);
      console.log(`   POST http://localhost:${PORT}/api/auth/signin - Login`);
      console.log(`   GET  http://localhost:${PORT}/api/blogs - Get blogs`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is busy. Try: PORT=3001 npm run dev`);
      } else {
        console.log('❌ Server error:', error.message);
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the application
startServer();