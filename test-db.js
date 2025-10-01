require('dotenv').config();
const mongoose = require('mongoose');

console.log('🧪 Testing MongoDB Connection...\n');

// Check if MONGODB_URI exists
if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Show connection string (hide password)
const safeURI = process.env.MONGODB_URI.replace(/:(.*)@/, ':****@');
console.log('Connection string:', safeURI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\n✅ MongoDB Connection Successful!');
    console.log('📍 Host:', mongoose.connection.host);
    console.log('📊 Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch(error => {
    console.log('\n❌ MongoDB Connection Failed:');
    console.log('Error:', error.message);
    console.log('\n🔧 Check:');
    console.log('1. Is your MONGODB_URI correct in .env?');
    console.log('2. Is your IP whitelisted in MongoDB Atlas?');
    console.log('3. Are your username and password correct?');
    console.log('4. Does the database exist?');
    process.exit(1);
  });