import { connectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import { Properties } from "@/models/property";

connectDb();

export async function POST(request) {
  const { userId } = await request.json();

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "User Id is required" },
        { status: 400 }
      );
    }

    const properties = await Properties.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: "$commonId",
          commonProperties: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          commonId: "$_id",
          commonProperties: 1,
        },
      },
    ]);
    console.log("properties: ", properties);

    if (!properties) {
      return NextResponse.json(
        { error: "No Properties found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ properties }, { status: 200 });
  } catch (err) {
    console.log("error in fetching properties by UserId: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
