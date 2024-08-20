import { connectDb } from "../../../helper/db";
import { NextRequest, NextResponse } from "next/server";
import { Property } from "@/models/listing";

connectDb();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const page = parseInt(searchParams.get("page") || "1", 10); 
  const skip = (page - 1) * limit;
  const rentalType = searchParams.get("rentalType");

  console.log('rentalType: ', rentalType);
  const filter = rentalType ? { rentalType } : {};

  try {
    const allProperties = await Property.find(filter).skip(skip).limit(limit);
    return NextResponse.json(allProperties);
  } catch (error) {
    console.error("Error fetching properties: ", error);
    return NextResponse.json({
      message: "Failed to fetch properties from the database",
    });
  }
}