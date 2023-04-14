const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

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

app.post('/api/sendEmail', (req, res) => {
    const { recipients, subject, message } = req.body;

    // Create a nodemailer transporter using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'emailfortestingcode1@gmail.com',
            pass: 'caicrcykupbqndns'
        }
    });

    // Configure the mail options
    const mailOptions = {
        from: 'emailfortestingcode1@gmail.com',
        to: recipients,
        subject,
        text: message
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log(`Email sent: ${info.response}`);
            res.status(200).json({ message: 'Email sent' });
        }
    });
});

app.listen(3001, () => console.log("server started on port 3001"))