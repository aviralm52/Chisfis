import { connectDb } from "@/helper/db";
import { NextResponse } from "next/server";
import { Property } from "@/models/listing";

connectDb();

export async function POST(req) {
  const reqBody = await req.json();
  const { propertyType } = reqBody;
  console.log("propertyType: ", propertyType);

  const searchRegex = new RegExp(propertyType, "i");
  console.log(searchRegex);

  try {
    const searchedProperties = await Property.find({
      propertyType: searchRegex,
    });
    console.log(searchedProperties);

    return NextResponse.json(searchedProperties);
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({
      message: "Failed to fetch properties",
    });
  }
}
