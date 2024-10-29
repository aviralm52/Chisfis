import { connectDb } from "@/helper/db";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { Bookings } from "@/models/bookings";
import { Properties } from "@/models/property";
import Travellers from "@/models/traveller";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail } from "@/helper/gmailMailer";
import Users from "@/models/user";
import { UserDataType } from "@/data/types";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const {
      propertyId,
      ownerEmail,
      startDate,
      endDate,
      guests,
      price,
      bookingStatus,
    } = await request.json();

    const travellerId = getDataFromToken(request);

    const owner: UserDataType | null = await Users.findOne({
      email: ownerEmail,
    });
    const ownerId = owner?._id;
    const ownerName = owner?.name;

    if (!owner) {
      return NextResponse.json({ error: "Owner not found!" }, { status: 401 });
    }

    if (
      !propertyId ||
      !ownerId ||
      !ownerName ||
      !travellerId ||
      !startDate ||
      !endDate ||
      !guests ||
      !price ||
      !bookingStatus
    ) {
      return NextResponse.json(
        { error: "Data insufficient for Booking" },
        { status: 401 }
      );
    }

    const property = await Properties.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const traveller = await Travellers.findById(travellerId);
    if (!traveller) {
      return NextResponse.json(
        { error: "You are not a traveller! Please login as a Traveller" },
        { status: 404 }
      );
    }

    const booking = await Bookings.create({
      propertyId,
      ownerId,
      travellerId,
      startDate,
      endDate,
      guests,
      price,
      bookingStatus,
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not created" },
        { status: 500 }
      );
    }

    // console.log("Booking Created: ", booking);

    try {
      const bookingId = booking._id;
      if (!bookingId)
        return NextResponse.json(
          { error: "Booking not created" },
          { status: 400 }
        );
      const bookingEmailResponse = await sendBookingEmail(bookingId, [
        traveller.email,
        property.email,
        "amantrivedi598@gmail.com",
      ]);
      // console.log("bookingEmailResponse: ", bookingEmailResponse);
    } catch (err) {
      return NextResponse.json({ error: "Email not sent!" }, { status: 400 });
    }

    try {
      const updateUser = await Users.findOneAndUpdate(
        { email: property.email },
        { $push: { myUpcommingRequests: booking._id } }
      );
    } catch (err) {
      console.log("User field not updated");
      return NextResponse.json(
        { error: "Booking requested but not updated in owner's profile" },
        { status: 400 }
      );
    }

    try {
      const updateTraveller = await Travellers.findByIdAndUpdate(travellerId, {
        $push: { myUpcommingRequests: booking._id },
      });
    } catch (err) {
      console.log("Traveller field not updated");
      return NextResponse.json(
        { error: "Booking requested but not updated in traveller's profile" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Booking Done Successfully", booking: booking },
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
