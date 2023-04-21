const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1 Create transporter
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });

  //   https://ethereal.email/create
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "gust50@ethereal.email",
      pass: "C1EDYQAdjD5brWYQ5f",
    },
  });

  // 2 Define the email options
  const mailOptions = {
    from: "",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3 Active send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
