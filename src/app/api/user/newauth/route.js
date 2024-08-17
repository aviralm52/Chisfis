// import nodemailer from "nodemailer";
// import {
//   RegistrationTemplate,
//   VerificationTemplate,
//   ResetPasswordTemplate,
//   ForgotPassword,
// } from "@/app/emailTemplate/email";

// export const sendEmail = async ({ email, subject, emailType, token, userId, password , resetPasswordLink }) => {
//   let temp;
//   switch (emailType) {
//     case "VERIFY":
//       const verificationLink = `${process.env.NEXT_PUBLIC_URL}/verifyemail?token=${token}`;
//       temp = VerificationTemplate(email, verificationLink,  password);
//       break;
//     case "REGISTRATION":
//       temp = RegistrationTemplate(email, subject);
//       break;
//     case "RESET_PASSWORD":
//       const resetPasswordLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;
//       temp = ResetPasswordTemplate(email, resetPasswordLink);
//       console.log(resetPasswordLink , "Email");
//       break;
//     case "FORGOT_PASSWORD":
//       temp = ForgotPassword(email);
//       break;
//     default:
//       throw new Error("Invalid email type");
//   }

//   try {
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "no-reply@vacationsaga.com",
//         pass: process.env.GMAIL_APP_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: "No Reply <no-reply@yourdomain.com>",
//       to: email,
//       subject: subject,
//       html: temp,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);
//     console.log("No-reply email sent successfully");
//   } catch (error) {
//     console.error("Error sending no-reply email:", error);
//     throw new Error("Could not send no-reply email");
//   }
// };

// TODO : Above code is working fine if you not able to implement just uncomment it and yah good to go....

import nodemailer from "nodemailer";
import Users from "@/models/user";
import bcryptjs from "bcryptjs";
import {
  VerificationTemplate,
  ResetPasswordTemplate,
  RegistrationTemplate,
  ForgotPassword,
} from "@/app/emailTemplate/email";

export const sendEmail = async ({ email, emailType, userId, password }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await Users.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    } else if (emailType === "RESET") {
      await Users.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "no-reply@vacationsaga.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    let templateContent;
    if (emailType === "VERIFY") {
      templateContent = VerificationTemplate(hashedToken, password, email);
    } else if (emailType === "RESET") {
      templateContent = ResetPasswordTemplate(hashedToken);
    }

    const mailOptions = {
      from: "No Reply <no-reply@vacationsaga.com>",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset Your Password",
      html: templateContent,
    };
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }
};
