const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Crear transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Definir opciones de email
    const mailOptions = {
        from: 'Equipo de Ride Hailing <4testsomeapps@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    };

    // 3) Enviar email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
