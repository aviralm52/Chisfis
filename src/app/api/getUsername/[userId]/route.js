import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const urlPathList = url.href.split('/');
  const userId = urlPathList[urlPathList.length - 1];

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    // return NextResponse.json({ username: user.username });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}