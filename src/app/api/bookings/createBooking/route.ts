import { connectDb } from "@/helper/db";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { Bookings } from "@/models/bookings";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const {
      propertyId,
      startDate,
      endDate,
      bookingStatus = "confirmed",
    } = await request.json();

    const userId = getDataFromToken(request);

    console.log(propertyId, userId, startDate, endDate, bookingStatus);

    const booking = await Bookings.create({
      propertyId,
      userId,
      startDate,
      endDate,
      bookingStatus,
    });

    console.log("Booking Created: ", booking);

    return NextResponse.json(
      { message: "Booking Done Successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in Booking: ", error);
    return NextResponse.json(
      { error: "Error in Booking", details: error.message },
      { status: 500 }
    );
  }
}
