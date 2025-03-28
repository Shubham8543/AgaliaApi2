const express = require ('express');
const router = express.Router();
const Form = require('../Models/Form'); 






router.post('/form/post', async (req, res) => {
    try {
        const { name, email, message, phone } = req.body;

        const newForm = new Form({ name, email, message, phone });
        await newForm.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'your-email@gmail.com', 
                pass: 'your-email-password', 
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'recipient-email@example.com', 
            subject: 'New Contact Form Submission',
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, data: newForm, message: "Form submitted successfully! Email sent." });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});


router.get('/forms/get', async (req, res) => {
    try {
        const forms = await Form.find();
        res.status(200).json({ success: true, data: forms });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ **GET API: Retrieve a Single Form Entry by ID**
router.get('/forms/get/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ success: false, message: "Form not found" });
        }
        res.status(200).json({ success: true, data: form });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/put/forms/:id', async (req, res) => {
    try {
        const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedForm) {
            return res.status(404).json({ success: false, message: "Form not found" });
        }
        res.status(200).json({ success: true, data: updatedForm, message: "Form updated successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.delete('/delete/forms/:id', async (req, res) => {
    try {
        const deletedForm = await Form.findByIdAndDelete(req.params.id);
        if (!deletedForm) {
            return res.status(404).json({ success: false, message: "Form not found" });
        }
        res.status(200).json({ success: true, message: "Form deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

