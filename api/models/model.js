const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const People = mongoose.model("People", staffSchema);

module.exports = People;