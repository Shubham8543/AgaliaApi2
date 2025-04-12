const express = require("express");
const router = express.Router();
const Form = require("../models/Form.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Correct SMTP Setup (Example using Gmail or other SMTP)
const transporter = nodemailer.createTransport({
  host: "sh006.hostgator.in", // ✅ Use your SMTP provider's host
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER, // example: info@agaliatech.com
    pass: process.env.EMAIL_PASS, // Gmail App Password or SMTP Password
  },
});

// ✅ POST Route: Submit Form
router.post("/form/post", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newForm = new Form({ name, email, phone, message });
    await newForm.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      data: newForm,
      message: "Form submitted successfully! Email sent.",
    });
  } catch (error) {
    console.error("Email Send Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ GET Route: All Forms
router.get("/forms/get", async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ DELETE Route: Delete Form by ID
router.delete("/forms/delete/:id", async (req, res) => {
  try {
    const deleted = await Form.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Form not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
