const mongoose = require('mongoose');

// Define the schema for the form
const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    message: {
        type: String,
        required: true,
        // trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    
});

// Create and export the model
const Form = mongoose.model("Form", formSchema);

module.exports = Form;
