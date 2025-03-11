const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "abeltsegaye0@gmail.com",
      pass: "mtwu dpck fuyn udpi",
    },
  });

  await transporter.sendMail({
    from: "ERC",
    to: email,
    subject: subject,
    html: text,
  });
};

module.exports = sendMail;