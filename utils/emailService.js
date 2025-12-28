const nodemailer = require('nodemailer');

const sendContactEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"${data.name}" <${data.email}>`,
    to: process.env.EMAIL_USER, // Email TechnoScape
    subject: `[HACKATHON 2026] ${data.subject}`,
    html: `<h3>Pesan Baru dari Form Contact Us</h3>
           <p><b>Dari:</b> ${data.name} (${data.email})</p>
           <p><b>Isi Pesan:</b><br/>${data.message}</p>`
  });
};

module.exports = { 
    sendContactEmail 
};