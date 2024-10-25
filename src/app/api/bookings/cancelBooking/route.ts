import { connectDb } from "@/helper/db";
import {
  sendBookingCancellationEmail,
  sendBookingEmail,
} from "@/helper/gmailMailer";
import { Bookings } from "@/models/bookings";
import Travellers from "@/models/traveller";
import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const { bookingId, ownerEmail, travellerEmail } = await request.json();
    console.log(bookingId, ownerEmail, travellerEmail);

    const booking = await Bookings.findOneAndUpdate(
      { _id: bookingId },
      { $set: { bookingStatus: "cancelled" } }
    );
    console.log("booking Updated", booking);

    try {
      const owner = await Users.updateOne(
        { email: ownerEmail },
        { $pull: { myUpcommingRequests: bookingId } },
        { $push: { declinedRequests: bookingId } }
      );
    } catch (err: any) {
      return NextResponse.json(
        { error: "Error in updating booking status of owner" },
        { status: 400 }
      );
    }

    try {
      const traveller = await Travellers.updateOne(
        { email: travellerEmail },
        { $pull: { myUpcommingRequests: bookingId } },
        { $push: { declinedRequests: bookingId } }
      );
    } catch (err: any) {
      return NextResponse.json(
        { error: "Error in updating booking status of traveller" },
        { status: 400 }
      );
    }

    try {
      const bookingCancellationResponse = await sendBookingCancellationEmail([
        ownerEmail,
        travellerEmail,
        "amantrivedi598@gmail.com",
      ]);
      console.log("bookingEmailResponse: ", bookingCancellationResponse);
    } catch (err) {
      return NextResponse.json({ error: "Email not sent!" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Booking Status Updated Successfully!" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Booking can not be cancelled!" },
      { status: 401 }
    );
  }
}
