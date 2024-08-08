import { sendEmail } from "@/helper/mailer";
import { connectDb } from "../../../../helper/db";
import User from "../../../../models/user";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

await connectDb();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { name, email, password, role } = reqBody;

    console.log(reqBody);
    // TODO: VALIDATION WILL GO HERE
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // TODO: Send Verification Email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.error("Error while creating user:", error);
    return NextResponse.json(
      { error: "Error while creating user" },
      { status: 500 }
    );
  }
}
