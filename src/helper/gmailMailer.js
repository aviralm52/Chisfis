// TODO: You have to remove the mailer functions and use gmailmailer

import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, text, price }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zairo.developer@gmail.com",
        pass: "gwlz rnrv gpio uzcp",
      },
    });

    // Set up email options
    const mailOptions = {
      from: `No Reply <no-reply@yourdomain.com>`,
      to: email,
      subject: subject,
      SelectedPrice: price,
      text: text,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log("No-reply email sent successfully");
  } catch (error) {
    console.error("Error sending no-reply email:", error);
    throw new Error("Could not send no-reply email");
  }
};

export const sendUserDetailsToCompany = async (userDetails) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zairo.developer@gmail.com",
        pass: "gwlz rnrv gpio uzcp",
      },
    });

    let subject, text;

    if (userDetails.price !== undefined) {
      subject = "User's selected price details";
      text = `
        Email: ${userDetails.email}
        Selected Plan: ${userDetails.price}
        Someone has choosen a price details are above.
      `;
    } else {
      subject = "User's Details";
      text = `
        Email: ${userDetails.email}
        Someone has listed a property contact details are above.
      `;
    }

    const mailOptions = {
      from: `No Reply <no-reply@yourdomain.com>`,
      to: "support@vacationsaga.com",
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);

    console.log("User details sent to company email successfully");
  } catch (error) {
    console.error("Error sending user details to company email:", error);
    throw new Error("Could not send user details to company email");
  }
};
