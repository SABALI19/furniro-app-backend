import nodemailer from "nodemailer";

export const createTransporter = () => {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass) {
        throw new Error("Missing email credentials. Set GMAIL_USER/GMAIL_PASS or EMAIL_USER/EMAIL_PASS in .env.");
    }

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user,
            pass,
        },
        logger: true,
        debug: true,
    });
};

export const sendOtpEmail = async (toEmail, otp) => {
    const transporter = createTransporter();
    const fromEmail = process.env.GMAIL_USER || process.env.EMAIL_USER;
    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
        html: `<div style="background-color: midnightblue; color: white; padding: 16px; font-family: Arial, sans-serif;">
            <p style="margin: 0 0 8px;">Your OTP code is:</p>
            <p style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
            <p style="margin: 12px 0 0;">It expires in 10 minutes.</p>
        </div>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw error;
    }
};
