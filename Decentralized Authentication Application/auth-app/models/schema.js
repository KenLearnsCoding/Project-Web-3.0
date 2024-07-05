import {Schema, model, mongoose} from 'mongoose';

// Create a schema
// Schema is a concept from the mongoose library, which is a MongoDB object modeling tool designed to work in an asynchronous environment. 
// A Schema in mongoose defines the structure of the document, default values, validators, etc., within a specific collection. 
// It serves as a blueprint for how data is organized and how it can be manipulated and validated.
// Only 3 values are received and assigned to the mongoDB
const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    blockchainAddress: {type: String, required: true}
});


const User = mongoose.models.User || model('User', userSchema);

export default User; 
