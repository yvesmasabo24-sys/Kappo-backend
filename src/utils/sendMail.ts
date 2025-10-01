import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {Transporter, SendMailOptions} from "nodemailer";
dotenv.config();

//create noemailer transporter

const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls:{
        rejectUnauthorized: false
    },

})

//dunction to send email

const mailerSender = async (
    to: string,
    subject: string,
    htmlContent: string
) : Promise<boolean> => {
    try {
        const mailOptions: SendMailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        };
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error: any) {
        console.error("Error sending email:", error);
        return false;
    }
};

export default mailerSender;