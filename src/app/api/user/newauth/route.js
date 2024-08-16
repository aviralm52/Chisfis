import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {RegistrationTemplate} from "@/app/emailTemplate/email";
import {ResetPasswordTemplate} from "@/app/emailTemplate/email";
import {ForgotPassword} from "@/app/emailTemplate/email";
import {VerificationTemplate} from "@/app/emailTemplate/email";




const sendEmail = async ({ email, subject }) => {
const temp = RegistrationTemplate(email , subject)
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'no-reply@vacationsaga.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    const mailOptions = {
      from: 'No Reply <no-reply@yourdomain.com>',
      to: email,
      subject: subject,
      html: temp, 
    };
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('No-reply email sent successfully');
  } catch (error) {
    console.error('Error sending no-reply email:', error);
    throw new Error('Could not send no-reply email');
  }
};



// Named export for POST method
export async function POST(req) {
  try {
    const { email, subject } = await req.json();

    if (!email || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await sendEmail({ email, subject });
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
