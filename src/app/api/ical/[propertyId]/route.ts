import { BookingDataType } from "@/data/types";
import { connectDb } from "@/helper/db";
import { Bookings } from "@/models/bookings";
import { NextRequest, NextResponse } from "next/server";

connectDb();

const createICalFeed = (bookings: BookingDataType[]) => {
  let icalFeed =
    "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Vacation Saga//Hosting Calendar//EN\r\nCALSCALE:GREGORIAN\r\nVERSION:2.0\r\n";

  bookings.forEach((booking) => {
    icalFeed += "BEGIN:VEVENT\r\n";
    icalFeed += `DTEND;VALUE=DATE:${formatDate(booking.endDate)}\r\n`;
    icalFeed += `DTSTART;VALUE=DATE:${formatDate(booking.startDate)}\r\n`;
    icalFeed += `UID:${booking._id}@vacationsaga.com\r\n`;
    icalFeed += "SUMMARY:Booked\r\n";
    icalFeed += "END:VEVENT\r\n";
  });

  icalFeed += "END:VCALENDAR";
  return icalFeed;
};

const formatDate = (date: Date) => {
  return date.toISOString().replace(/[-:]/g, "").split("T")[0];
};

// This function will handle GET requests to /api/ical/[propertyId]
export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const { propertyId } = params;
  console.log("propertyId: ", propertyId);

  try {
    const confirmedBookings = await Bookings.find({
      propertyId,
      bookingStatus: "confirmed",
    });

    const icalFeed = createICalFeed(confirmedBookings);
    console.log("icalFeed: ", icalFeed);

    return new NextResponse(icalFeed, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": `attachment; filename="property_${propertyId}_calendar.ics"`,
      },
    });
  } catch (error) {
    console.error("Error serving iCal feed:", error);
    return NextResponse.json(
      { error: "Error in serving iCal feed" },
      { status: 500 }
    );
  }
}
