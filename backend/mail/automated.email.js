import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();


export async function sendEmail(to, subject, message) {
    const mail = process.env['MAIL_USERNAME'];
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: mail,
            pass: process.env['MAIL_PASSWORD']
        }
    });
    let mailOptions = {
        from: mail,
        to: to,
        subject: subject,
        text: message
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("E-Mail gesendet:", info.response);
    } catch (error) {
        console.error("Fehler beim Senden:", error);
    }
}

//sendEmail("tim.kiebler@gmx.de", "Test Betreff", "Hallo, dies ist eine Test-Mail!");
