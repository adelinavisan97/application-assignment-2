const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const peopleSchema = new Schema({
    name: {
        type: String,
        required: false
    },

    availability:
    {
        type: Boolean,
        default: false,
    }
})

const People = mongoose.model("People", peopleSchema);

module.exports = People;