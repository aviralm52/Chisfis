import { connectDb } from "@/helper/db";
import { sendBookingCancellationEmail } from "@/helper/gmailMailer";
import { Bookings } from "@/models/bookings";
import Travellers from "@/models/traveller";
import Users from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
connectDb();

export async function POST(request: NextRequest) {
  try {
    const { bookingId, ownerEmail, travellerEmail, cancellationReason } =
      await request.json();
    const booking = await Bookings.findOneAndUpdate(
      { _id: bookingId },
      { $set: { bookingStatus: "cancelled" } }
    );
    await Users.updateOne(
      { email: ownerEmail },
      {
        $pull: { myUpcommingRequests: bookingId },
        $push: { declinedRequests: { bookingId, reason: cancellationReason } },
      }
    );
    await Travellers.updateOne(
      { email: travellerEmail },
      {
        $pull: { myUpcommingRequests: bookingId },
        $push: { declinedRequests: { bookingId, reason: cancellationReason } },
      }
    );
    try {
      await sendBookingCancellationEmail([
        ownerEmail,
        travellerEmail,
        "amantrivedi598@gmail.com",
      ]);
    } catch (err) {
      return NextResponse.json({ error: "Email not sent!" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Booking Status Updated Successfully!" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Booking cannot be cancelled!" },
      { status: 401 }
    );
  }
}
