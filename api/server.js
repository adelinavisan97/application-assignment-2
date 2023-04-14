const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://visanadelina:abc123.@cluster0.azypm3a.mongodb.net/AssignmentDatabase?appName=mongosh+1.8.0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

const People = require('./models/model');

app.get('/people', async (req, res) => {
    const people = await People.find();

    res.json(people);
})

app.post('/new-entry', (req, res) => {
    const entry = new People({
        name: req.body.name,
        email: req.body.email
    });

    entry.save();

    res.json(entry);
})

app.delete('/entry/delete/:id', async (req, res) => {
    const result = await People.findByIdAndDelete(req.params.id);

    res.json(result);
});


app.listen(3001, () => console.log("server started on port 3001"))