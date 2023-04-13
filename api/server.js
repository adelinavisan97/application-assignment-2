const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://visanadelina:abc123.@cluster0.azypm3a.mongodb.net/Availability?appName=mongosh+1.8.0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

const Table = require('./models/model');
const People = require('./models/model');

app.get('/availability', async (req, res) => {
    const availaility = await People.find();

    res.json(availaility);
})

app.post('/new-entry', (req, res) => {
    const entry = new People({
        name: req.body.name,
    });

    entry.save();

    res.json(entry);
})

app.delete('/entry/delete/:id', async (req, res) => {
    const result = await People.findByIdAndDelete(req.params.id);

    res.json(result);
});

app.get('/availability/true/:id', async (req, res) => {
    const availability = await People.findById(req.params.id);

    availability.availability = !availability.availability;

    availability.save();

    res.json(availability);
})

app.put('/entry/update/:id', async (req, res) => {
    const updatedAvailability = await People.findById(req.params.id);

    updatedAvailability.availability = req.body.availability;

    updatedAvailability.save();

    res.json(updatedAvailability);
});


app.listen(3001, () => console.log("server started on port 3001"))