import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const sendOtpEmail = async (email, otp) => {
  if (!email) {
    throw new Error("Recipient email address is required");
  }

  const templateParams = {
    to_email: email,
    otp_code: otp,
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    return result;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

export default sendOtpEmail;
