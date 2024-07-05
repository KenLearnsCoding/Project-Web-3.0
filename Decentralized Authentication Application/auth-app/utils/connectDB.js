const  mongoose = require('mongoose');
const uri = "mongodb://root:password@127.0.0.1/";
// mongoose is a library for Node.js that provides a straightforward, schema-based solution to model your application data. 
// It includes built-in type casting, validation, query building, business logic hooks, and more, out of the box. 
// Mongoose is designed to work with MongoDB, which is a NoSQL database that stores data in flexible, JSON-like documents.
const connectDB = async () => {
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    }
    catch(err) {
        console.error(err.message);
        process.exit(1);
    }
}

export default connectDB;