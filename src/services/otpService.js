const otpStorage = new Map();

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email, otp) {
  otpStorage.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // expires in 5 minutes
  });
}

export async function verifyOTP(email, otp) {
  const stored = otpStorage.get(email);
  if (!stored) throw new Error("No OTP found for this email");

  if (Date.now() > stored.expiresAt) {
    otpStorage.delete(email);
    throw new Error("OTP expired");
  }

  if (stored.otp !== otp) throw new Error("Invalid OTP");

  otpStorage.delete(email);
  return true;
}
