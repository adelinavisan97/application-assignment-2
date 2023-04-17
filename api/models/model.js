// Import the mongoose library 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new Mongoose schema
const staffSchema = new Schema({
    name: {
        type: String,
        required: false
    },

    email:
    {
        type: String,
        required: true
    }
})

// Create a new Mongoose model called "People" using the schema defined above
const People = mongoose.model("People", staffSchema);

// Export the "People" model for use in other files
module.exports = People;