const { Router } = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const router = Router();

router.post("/newsLetter", async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"BLOGIFY" <anmolubisoft@gmail.com>`,
    to: email,
    subject: "Thanks for subscribing",
    text: `Hello ${email},

Thank you for subscribing to the BLOGIFY's newsletter!

We're excited to have you on board. As a subscriber, you'll receive the latest updates, articles, and exclusive content directly in your inbox. 
Stay tuned for our upcoming posts, and feel free to reach out if you have any suggestions or questions.

We're looking forward to sharing our journey with you!

Best regards,
Anmol Ramola
Founder,
BLOGIFY`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error subscribing to newsletter.");
  }
});

module.exports = router;
