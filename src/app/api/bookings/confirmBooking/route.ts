import { connectDb } from "@/helper/db";
import { Property } from "@/models/listing";
import Travellers from "@/models/traveller";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function POST(request: NextRequest) {
  const { propertyId, user, portion, startDate, endDate, guests } =
    await request.json();

  if (
    !propertyId ||
    !user ||
    !portion ||
    !startDate ||
    !endDate ||
    !guests
  ) {
    return NextResponse.json(
      { error: "Please provide all the fields." },
      { status: 401 }
    );
  }

  try {

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 401 }
      );
    }

    const traveller = await Travellers.findOne({ email: user.email });
    if (!traveller) {
      return NextResponse.json(
        { error: "Please register as a Traveller first" },
        { status: 400 }
      );
    }



  } catch (err: any) {

    return NextResponse.json(
      { error: "Error in confirming booking" },
      { status: 401 }
    );
  }
}
