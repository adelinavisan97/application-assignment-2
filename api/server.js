// Importing dependencies
const express = require('express'); // For building the API
const mongoose = require('mongoose'); // For interacting with MongoDB
const cors = require('cors'); // For enabling Cross-Origin Resource Sharing
const bodyParser = require('body-parser'); // For parsing incoming request bodies
const nodemailer = require('nodemailer'); // For sending emails

// Creating an instance of the Express.js application
const app = express();

app.use(express.json()); // Parse JSON-encoded request bodies
app.use(cors()); // Allow Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON-encoded request bodies

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://visanadelina:abc123.@cluster0.azypm3a.mongodb.net/AssignmentDatabase?appName=mongosh+1.8.0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

// Import the People model from models/model.js
const People = require('./models/model');

// Handle GET requests for /people
app.get('/people', async (req, res) => {
    // Find all documents in the People collection
    const people = await People.find();

    // Return the documents as a JSON array in the response body
    res.json(people);
});

// Handle POST requests for /new-entry
app.post('/new-entry', (req, res) => {
    // Create a new instance of the People model with data from the request body
    const entry = new People({
        name: req.body.name,
        email: req.body.email
    });

    // Save the new document to the People collection
    entry.save();

    // Return the new document as a JSON object in the response body
    res.json(entry);
});

// Handle DELETE requests for /entry/delete/:id
app.delete('/entry/delete/:id', async (req, res) => {
    // Find the document with the given ID and delete it
    const result = await People.findByIdAndDelete(req.params.id);

    // Return the deleted document as a JSON object in the response body
    res.json(result);
});

// Handle POST requests for /api/sendEmail
app.post('/api/sendEmail', (req, res) => {
    // Extract data from the request body
    const { recipients, subject, message } = req.body;

    // Load environment variables from a .env file
    require('dotenv').config();

    // Create a nodemailer transporter using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Configure the mail options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients,
        subject,
        text: message
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // Log the error and return a 500 Internal Server Error response
            console.error(error);
            res.status(500).json({ error: 'Failed to send email' });
        } else {
            // Log the successful email send and return a 200 OK response
            console.log(`Email sent: ${info.response}`);
            res.status(200).json({ message: 'Email sent' });
        }
    });
});

// Start the server on port 3001
app.listen(3001, () => console.log("server started on port 3001"));
