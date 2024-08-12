import { connectDb } from "../../../../helper/db";
import { NextResponse } from "next/server";
connectDb();

export async function GET(request) {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { success: true }
    );
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch {}
}
