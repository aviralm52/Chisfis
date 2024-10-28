"use client";

import {
  BookingDataType,
  PropertiesDataType,
  UserDataType,
} from "@/data/types";
import axios from "axios";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { TbExternalLink } from "react-icons/tb";
import ConfirmationModal from "@/components/ConfirmationModal";

export interface PageProps {
  params: {
    id: string;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const bookingId = params.id[0];
  const [traveller, setTraveller] = useState<UserDataType>();
  const [property, setProperty] = useState<PropertiesDataType>();
  const [booking, setBooking] = useState<BookingDataType>();
  const [status, setStatus] = useState("pending");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentToken, setPaymentToken] = useState();

  const calculateNights = (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    if (!startDate || !endDate) return;
    const timeDifference =
      new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.round(timeDifference / (24 * 3600 * 1000));
  };

  const calculatePrice = (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    if (!startDate || !endDate || !property) return;

    const stdt = new Date(startDate);
    const nddt = new Date(endDate);
    let totalPrice = 0;
    while (stdt < nddt) {
      const month = stdt.getMonth();
      const day = stdt.getDate() - 1;
      totalPrice += property.pricePerDay[month][day];
      stdt.setDate(stdt.getDate() + 1);
    }
    return totalPrice;
  };

  const handleDecline = async () => {
    setStatus("declined");

    if (!booking || !property || !traveller) return;

    try {
      const response = await axios.post("/api/bookings/cancelBooking", {
        booking: booking,
        propertyId: booking?.propertyId,
        travellerEmail: traveller?.email,
      });
      // console.log(response);
      toast.success("Property Status Updated Successfully");
    } catch (err: any) {
      // console.log("error in updating booking status: ", err);
      toast.error(err.response.data.error);
    }
  };

  const handleAccept = async () => {
    setModalOpen(true);
  };

  const handleModalAccept = async () => {
    setStatus("accepted");
    setIsLoading(true);
    let encryptedToken;
    try {
      const response = await axios.post("/api/encrypt", { amount: 6 });
      // console.log("token response: ", response.data);
      encryptedToken = response.data.encryptedAmount;
      setPaymentToken(response.data.encryptedAmount);
    } catch (err: any) {
      // console.log("err: ", err);
      toast.error("Payment Token Not Generated, Please Try again");
    }
    // console.log("encrypted Token: ", encryptedToken);

    try {
      const response = await axios.post("/api/bookings/confirmBooking", {
        booking: booking,
        propertyId: booking?.propertyId,
        travellerEmail: traveller?.email,
        paymentToken: encryptedToken,
      });
      // console.log(response);
      setStatus("accepted");
    } catch (err: any) {
      // console.log("error in updating booking status: ", err);
      toast.error(err.response.data.error);
    }
    setIsLoading(false);
    setModalOpen(false);
  };

  const handleModalDeny = async () => {
    setModalOpen(false);
  };

  const getDetailsByBookingId = async () => {
    try {
      const response = await axios.post("/api/bookings/getDetailsByBookingId", {
        bookingId,
      });
      setProperty(response.data.property);
      setTraveller(response.data.traveller);
      setBooking(response.data.booking);
      toast.success("fetched travellerDetails");
    } catch (err: any) {
      // console.log("error: ", err);
      toast.error(err.response.data.error);
    }
  };

  useEffect(() => {
    if (bookingId) {
      getDetailsByBookingId();
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto border-2 border-neutral-600 rounded-lg shadow-md bg-transparent">
        <div className="p-4 border-b flex justify-between">
          <h2 className="text-2xl font-bold">Booking Request</h2>
          <Link href={`/listing-stay-detail/${property?._id}`} target="_blank">
            <button className=" bg-primary-6000 hover:bg-primary-700 px-3 py-1 rounded-lg font-medium flex gap-x-1 items-center">
              View Property {<TbExternalLink />}
            </button>
          </Link>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={traveller?.profilePic}
              alt="Profile"
              className=" rounded-full object-center w-28 h-28"
            />
            <div>
              <h3 className="text-xl font-semibold">{traveller?.name}</h3>
              <p className="text-sm text-gray-500">{traveller?.email}</p>
              <p className="text-sm text-gray-500">{traveller?.phone}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span>📅</span>
              <span>
                Check-in: {booking?.startDate?.toLocaleString().split("T")[0]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📅</span>
              <span>
                Check-out: {booking?.endDate?.toLocaleString().split("T")[0]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>👥</span>
              <span>Guests: {booking?.guests}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🕒</span>
              <span>
                Nights: {calculateNights(booking?.startDate, booking?.endDate)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>{traveller?.address}</span>
          </div>
          <div className="bg-transparent p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Total Price:</h3>
            <p className="text-2xl font-bold">
              € {calculatePrice(booking?.startDate, booking?.endDate)}
            </p>
          </div>
        </div>
        <div className="p-4 flex justify-between border-t">
          <button
            onClick={handleDecline}
            className="px-4 py-2 font-semibold border rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            disabled={
              status !== "pending" ||
              booking?.bookingStatus === "cancelled" ||
              booking?.bookingStatus === "confirmed" ||
              !booking
            }
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-primary-6000 text-white rounded hover:bg-primary-700 disabled:opacity-50"
            disabled={
              status !== "pending" ||
              booking?.bookingStatus === "cancelled" ||
              booking?.bookingStatus === "confirmed" ||
              !booking
            }
          >
            Accept
          </button>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onAccept={handleModalAccept}
          onDeny={handleModalDeny}
          isLoading={isLoading}
        />
      </div>
      {status !== "pending" && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">
            Booking request {status === "accepted" ? "accepted" : "declined"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
