import nodemailer from "nodemailer";
import User from "../models/user";
import bcryptjs from "bcryptjs";

interface SendEmailOptions {
  email: string;
  emailType: string;
  userId: string;
}
export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailOptions) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "969174ac907b1a", // TODO: MOVE THIS TO .ENV
        pass: "ff6f8c56bd3348", // TODO: MOVE THIS TO .ENV
      },
    });
    const mailOption = {
      from: "amantrivedi597@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset Your Password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } <br> or copypaste the link into your browser:</p><br>
             ${process.env.DOMAIN}/verifyemail?token=${hashedToken}`,
    };

    const mailResponse = await transport.sendMail(mailOption);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
