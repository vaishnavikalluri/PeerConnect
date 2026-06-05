import { sendEmail } from "../services/emailService.js";

export const sendTestEmail = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email } = req.body;

    console.log("EMAIL:", email);

    await sendEmail(
      email,
      "PeerConnect Test Email",
      "<h2>Email Service Working Successfully!</h2>"
    );

    res.status(200).json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};