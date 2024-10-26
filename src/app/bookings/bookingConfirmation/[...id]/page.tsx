"use client";
import {
  BookingDataType,
  PropertiesDataType,
  UserDataType,
} from "@/data/types";
import axios from "axios";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import { TbExternalLink } from "react-icons/tb";
import { BiLoaderAlt } from "react-icons/bi";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";

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
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [loading, setLoading] = useState(false);
  const handleAccept = () => {
    setStatus("accepted");
  };
  const handleDecline = async () => {
    if (!cancellationReason) {
      toast.error("Please enter a reason for cancellation.");
      return;
    }
    setStatus("declined");
    if (!booking || !property || !traveller) return;
    try {
      setLoading(true);
      const response = await axios.post("/api/bookings/cancelBooking", {
        bookingId: booking?._id,
        ownerEmail: property?.email,
        travellerEmail: traveller?.email,
        cancellationReason,
      });
      console.log(response);
      toast.success("Property Status Updated Successfully");
      setLoading(false);
    } catch (err: any) {
      console.log("Error in updating booking status: ", err);
      toast.error(err.response.data.error);
      setLoading(false);
    }
    setShowReasonModal(false);
  };
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
    while (stdt <= nddt) {
      const month = stdt.getMonth();
      const day = stdt.getDate() - 1;
      totalPrice += property.pricePerDay[month][day];
      stdt.setDate(stdt.getDate() + 1);
    }
    return totalPrice;
  };

  const getTravellerByBookingId = async () => {
    try {
      const response = await axios.post("/api/bookings/getDetailsByBookingId", {
        bookingId,
      });
      setProperty(response.data.property);
      setTraveller(response.data.traveller);
      setBooking(response.data.booking);
    } catch (err: any) {
      toast.error(err.response.data.error);
    }
  };
  useEffect(() => {
    if (bookingId) {
      getTravellerByBookingId();
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
        <div className="p-2 flex justify-between border-t">
          <div className="container mx-auto">
            <ButtonSecondary
              onClick={() => setShowReasonModal(true)}
              disabled={
                status !== "pending" || booking?.bookingStatus === "cancelled"
              }
            >
              Decline
            </ButtonSecondary>

            {showReasonModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className=" p-4 rounded-lg shadow-lg z-50 bg-slate-800 max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-2">
                    Reason for Cancellation
                  </h3>
                  <textarea
                    className="w-full p-2 text-slate-800 border rounded-lg"
                    rows={4}
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Please share a reason to help us improve our service."
                  />
                  <div className="flex justify-end mt-4">
                    <ButtonSecondary
                      onClick={() => setShowReasonModal(false)}
                      className="px-4 py-2 mr-2 border rounded hover:bg-gray-200"
                    >
                      Close
                    </ButtonSecondary>
                    <ButtonPrimary onClick={handleDecline} disabled={loading}>
                      {loading ? (
                        <span className="flex items-center gap-x-1">
                          Canceling... <BiLoaderAlt className="animate-spin" />{" "}
                        </span>
                      ) : (
                        "Continue"
                      )}
                    </ButtonPrimary>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <button
            onClick={handleDecline}
            className="px-4 py-2 font-semibold border rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            disabled={
              status !== "pending" || booking?.bookingStatus === "cancelled"
            }
          >
            Decline
          </button> */}
          <ButtonPrimary
            onClick={handleAccept}
            disabled={
              status !== "pending" || booking?.bookingStatus === "cancelled"
            }
          >
            Accept
          </ButtonPrimary>
        </div>
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
