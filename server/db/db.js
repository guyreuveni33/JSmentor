const mongoose = require('mongoose');
// Connect to the MongoDB database using the connection string in the .env file
const connectToDatabase = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB successfully');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });
};

module.exports = { connectToDatabase };