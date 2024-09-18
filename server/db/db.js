const mongoose = require('mongoose');

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