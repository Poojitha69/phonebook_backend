const mongoose = require('mongoose');


//function to connect to MongoDB
 async function connectDB() {

    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/phonebook');
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
       
    }

}


module.exports = connectDB;
