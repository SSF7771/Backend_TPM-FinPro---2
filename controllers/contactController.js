const prisma = require('../lib/prisma');
const { sendContactEmail } = require('../utils/emailService');

const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) 
      return res.status(400).json({ success: false, message: "Semua field harus diisi!" });
    

    // Save ke database MySQL
    const newMessage = await prisma.message.create({
      data: { name, email, subject, message }
    });

    // Send notifikasi email
    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({
      success: true,
      message: "Pesan berhasil terkirim!",
      data: newMessage
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
    submitContactForm 
};