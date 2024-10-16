"use client";

import { Tab } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import React, { FC, Fragment, useState, useEffect } from "react";
import visaPng from "@/images/vis.png";
import mastercardPng from "@/images/mastercard.svg";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";
import StartRating from "@/components/StartRating";
import NcModal from "@/shared/NcModal";
import ModalSelectDate from "@/components/ModalSelectDateTwo";
import converSelectedDateToString from "@/utils/converSelectedDateToString";
import ModalSelectGuests from "@/components/ModalSelectGuests";
import Image from "next/image";
import { GuestsObject } from "../(client-components)/type";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { ObjectId } from "mongodb";
import { end } from "@cloudinary/url-gen/qualifiers/textAlignment";
import { start } from "repl";
import { Properties } from "../page";
import { AiFillQuestionCircle } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuLoader2 } from "react-icons/lu";
import { TokenDataType } from "@/data/types";

export interface CheckOutPagePageMainProps {
  className?: string;
}

const CheckOutPagePageMain: FC<CheckOutPagePageMainProps> = ({
  className = "",
}) => {
  // const [reservedDates, setReservedDates] = useState<Date[]>(() => {
  //   const savedDates =
  //     localStorage.getItem("dates") || JSON.stringify(Date.now());
  //   if (!savedDates) {
  //     return [Date.now(), Date.now()];
  //   }
  //   const dates = JSON.parse(savedDates);
  //   return [dates.startDate, dates.endDate];
  // });

  const searchParams = useSearchParams();
  const param: string = searchParams.get("id")?.split("&")[0] || "0";
  const paramInt: number = parseInt(param, 10);
  const portion = searchParams.get("portion");
  const startDateParam = searchParams.get("stdt");
  const endDateParam = searchParams.get("nddt");
  const guestsParam = searchParams.get("guests");

  console.log(param, portion, startDateParam, endDateParam, guestsParam);

  const router = useRouter();

  const [particularProperty, setParticualarProperty] = useState<Properties>();
  const [paymentToken, setPaymentToken] = useState<string>("");
  const [subscribeLoader, setSubscribeLoader] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<TokenDataType | undefined>();

  const getLoggedInUser = async () => {
    try {
      const response = await axios.post("/api/user/profile");
      console.log(response.data);
      setLoggedInUser(response.data);
    } catch (err: any) {
      console.log("error in getting logged in user: ", err);
    }
  };

  const [startDate, setStartDate] = useState<Date | null>(() => {
    const savedDate = localStorage.getItem("dates");
    if (!savedDate) {
      return new Date();
    }
    const date = JSON.parse(savedDate);
    console.log("start date: ", new Date(date.startDate), date.startDate);
    return new Date(date.startDate);
  });

  const [endDate, setEndDate] = useState<Date | null>(() => {
    const savedDate = localStorage.getItem("dates");
    if (!savedDate) {
      return new Date();
    }
    const date = JSON.parse(savedDate);
    return new Date(date.endDate);
  });

  const [guests, setGuests] = useState<GuestsObject>(() => {
    const savedGuests = localStorage.getItem("guestsState");
    if (!savedGuests) {
      return { guestAdults: 3, guestChildren: 0, guestInfants: 0 };
    }
    const gsts = JSON.parse(savedGuests);
    return {
      guestAdults: gsts.adults,
      guestChildren: gsts.children,
      guestInfants: gsts.infants,
    };
  });

  useEffect(() => {
    const getProperty = async () => {
      try {
        const response = await axios.get(`/api/particular/${param}`);
        if (response.data) {
          setParticualarProperty(response?.data);
        }
      } catch (err: any) {
        console.log("Property can't be fetched on checkout Page");
      }
    };

    getProperty();

    setStartDate(new Date(startDateParam || new Date()));
    setEndDate(new Date(endDateParam || new Date()));
  }, []);

  const [startone, setStartOne] = useState<Date | null>(null);
  const [endone, setEndOne] = useState<Date | null>(null);

  const [guestAdult, setGuestAdult] = useState<number | undefined>();
  const [guestChildren, setGuestChildren] = useState<number | undefined>();
  const [guestInfants, setGuestInfants] = useState<number | undefined>();

  const [dateDiff, setDateDiff] = useState<number>(3);
  const calculateDifferenceBetweenDates = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (startDate && endDate) {
      const miliDifference = Math.abs(endDate.getTime() - startDate.getTime());
      const days = Math.ceil(miliDifference / (1000 * 60 * 60 * 24));
      return days;
    }
    return 3;
  };

  useEffect(() => {
    if (!startone) {
      setStartOne(startDate);
    }
    if (!endone) {
      setEndOne(endDate);
    }
    if (!guestAdult) {
      setGuestAdult(guests.guestAdults);
    }
    if (!guestChildren) {
      setGuestChildren(guests.guestChildren);
    }
    if (!guestInfants) {
      setGuestInfants(guests.guestInfants);
    }
  }, []);

  useEffect(() => {
    const diff = calculateDifferenceBetweenDates(startDate, endDate);
    setDateDiff(diff);
  }, [startDate, endDate]);

  useEffect(() => {
    const updatedGuests: GuestsObject = {
      guestAdults: guestAdult,
      guestChildren: guestChildren,
      guestInfants: guestInfants,
    };
    setGuests(updatedGuests);
  }, [guestAdult, guestChildren, guestInfants]);

  useEffect(() => {
    const savedDates = JSON.stringify({
      startDate: startDate,
      endDate: endDate,
    });
    localStorage.setItem("dates", savedDates);
  }, [startDate, endDate]);

  const encryptToken = async (amount: number) => {
    setSubscribeLoader(true);
    try {
      const response = await axios.post("/api/encrypt", { amount });
      console.log("token response: ", response.data);
      setSubscribeLoader(false);
      return response.data.encryptedAmount;
    } catch (err) {
      console.log(err);
      setSubscribeLoader(false);
    }
    setSubscribeLoader(false);
  };

  const handlePayment = async (amount: string) => {
    const val = parseInt(amount);
    const token = await encryptToken(val);
    console.log("response token: ", token);

    if (token) {
      router.push(
        `/payment?pId=${particularProperty?._id}&amount=${val}&paymentToken=${token}`
      );
    }
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  const handleBookingConfirmation = async () => {
    if (!loggedInUser || !loggedInUser.email) return;
    try {
      const response = await axios.post(`/api/bookings/confirmBooking`, {
        propertyId: param,
        user: loggedInUser,
        portion,
        startDate,
        endDate,
        guests
      });
      console.log("Booking Response: ", response.data);
    } catch (err: any) {
      console.log("Error in booking confirmation: ", err);
    }
  };

  const renderSidebar = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl lg:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex-shrink-0 w-full sm:w-40">
            <div className=" aspect-w-4 aspect-h-3 sm:aspect-h-4 rounded-2xl overflow-hidden">
              <img
                src={particularProperty?.propertyCoverFileUrl}
                alt="coverImage"
              />
            </div>
          </div>
          <div className="py-5 sm:px-5 space-y-3">
            <div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {/* Hotel room in Tokyo, Jappan */}
                {particularProperty?.placeName}
              </span>
              <span className="text-base font-medium mt-1 block">
                {/* The Lounge & Bar */}
                {particularProperty?.propertyType}
              </span>
            </div>
            <span className="block  text-sm text-neutral-500 dark:text-neutral-400">
              {/* 2 beds · 2 baths */}
              {particularProperty?.bedrooms?.[0]} beds ·{" "}
              {particularProperty?.bathroom?.[0]} bath
            </span>
            <div className="w-10 border-b border-neutral-200  dark:border-neutral-700"></div>
            <StartRating />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Price detail</h3>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>
              € {particularProperty?.basePrice?.[0]} x{" "}
              {/* {calculateDifferenceBetweenDates(startDate, endDate)} day */}
              {startone &&
                endone &&
                calculateDifferenceBetweenDates(startone, endone)}{" "}
              days
            </span>
            <span>
              {/* € {(particularProperty?.basePrice[0] || 100) * dateDiff} */}€{" "}
              {(particularProperty?.basePrice?.[0] || 100) *
                calculateDifferenceBetweenDates(startone, endone)}
            </span>
          </div>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Service charge</span>
            <span>€ 6</span>
          </div>

          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              {/* € {dateDiff * (particularProperty?.basePrice[0] || 100) + 6}
              {" "} */}
              €{" "}
              {calculateDifferenceBetweenDates(startone, endone) *
                (particularProperty?.basePrice?.[0] || 100) +
                6}{" "}
            </span>
          </div>
          <div className=" w-full flex justify-center mt-2">
            {particularProperty?.isInstantBooking && (
              <ButtonPrimary
                disabled={subscribeLoader}
                onClick={() => handlePayment("6")}
              >
                {subscribeLoader ? (
                  <LuLoader2 className=" animate-spin" />
                ) : (
                  "Pay € 6"
                )}
              </ButtonPrimary>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMain = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8">
        <div className=" flex gap-x-3 items-center">
          {" "}
          <h2 className="text-3xl lg:text-4xl font-semibold whitespace-nowrap">
            {particularProperty?.isInstantBooking
              ? "Instant booking"
              : "Confirm and Request"}
          </h2>
          <abbr title="Only € 6 have to be paid now and rest will be paid directly to Owner">
            <AiFillQuestionCircle className="w-8 h-8 cursor-pointer" />
          </abbr>
        </div>
        <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <div>
            <h3 className="text-2xl font-semibold">Your trip</h3>
            <NcModal
              renderTrigger={(openModal) => (
                <span
                  onClick={() => openModal()}
                  className="block lg:hidden underline  mt-1 cursor-pointer"
                >
                  View booking details
                </span>
              )}
              renderContent={renderSidebar}
              modalTitle="Booking details"
            />
          </div>
          <div className="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 divide-neutral-200 dark:divide-neutral-700 overflow-hidden z-10">
            <ModalSelectDate
              setStartOne={(value) => setStartOne(value)}
              setEndOne={(value) => setEndOne(value)}
              renderChildren={({ openModal }) => (
                <button
                  onClick={openModal}
                  className="text-left flex-1 p-5 flex justify-between space-x-5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  type="button"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Date</span>
                    <span className="mt-1.5 text-lg font-semibold">
                      {/* {converSelectedDateToString([startDate, endDate])} */}
                      {converSelectedDateToString([startone, endone])}
                    </span>
                  </div>
                  <PencilSquareIcon className="w-6 h-6 text-neutral-6000 dark:text-neutral-400" />
                </button>
              )}
            />

            <ModalSelectGuests
              setAdults={(value) => setGuestAdult(value)}
              setChildren={(value) => setGuestChildren(value)}
              renderChildren={({ openModal }) => (
                <button
                  type="button"
                  onClick={openModal}
                  className="text-left flex-1 p-5 flex justify-between space-x-5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Guests</span>
                    <span className="mt-1.5 text-lg font-semibold">
                      <span className="line-clamp-1">
                        {`${
                          (guests.guestAdults || 0) +
                          (guests.guestChildren || 0)
                        } Guests`}
                      </span>
                    </span>
                  </div>
                  <PencilSquareIcon className="w-6 h-6 text-neutral-6000 dark:text-neutral-400" />
                </button>
              )}
            />
          </div>
        </div>

        {/* <div>
          <h3 className="text-2xl font-semibold">Pay with</h3>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>

          <div className="mt-6">
            <Tab.Group>
              <Tab.List className="flex my-5 gap-1">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full focus:outline-none ${
                        selected
                          ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900"
                          : "text-neutral-6000 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      Paypal
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`px-4 py-1.5 sm:px-6 sm:py-2.5  rounded-full flex items-center justify-center focus:outline-none  ${
                        selected
                          ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900"
                          : " text-neutral-6000 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span className="mr-2.5">Credit card</span>
                      <Image className="w-8" src={visaPng} alt="visa" />
                      <Image
                        className="w-8"
                        src={mastercardPng}
                        alt="mastercard"
                      />
                    </button>
                  )}
                </Tab>
              </Tab.List>

              <Tab.Panels>
                <Tab.Panel className="space-y-5">
                  <div className="space-y-1">
                    <Label>Card number </Label>
                    <Input defaultValue="111 112 222 999" />
                  </div>
                  <div className="space-y-1">
                    <Label>Card holder </Label>
                    <Input defaultValue="JOHN DOE" />
                  </div>
                  <div className="flex space-x-5  ">
                    <div className="flex-1 space-y-1">
                      <Label>Expiration date </Label>
                      <Input type="date" defaultValue="MM/YY" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label>CVC </Label>
                      <Input />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Messager for author </Label>
                    <Textarea placeholder="..." />
                    <span className="text-sm text-neutral-500 block">
                      Write a few sentences about yourself.
                    </span>
                  </div>
                </Tab.Panel>
                <Tab.Panel className="space-y-5">
                  <div className="space-y-1">
                    <Label>Email </Label>
                    <Input type="email" defaultValue="example@gmail.com" />
                  </div>
                  <div className="space-y-1">
                    <Label>Password </Label>
                    <Input type="password" defaultValue="***" />
                  </div>
                  <div className="space-y-1">
                    <Label>Messager for author </Label>
                    <Textarea placeholder="..." />
                    <span className="text-sm text-neutral-500 block">
                      Write a few sentences about yourself.
                    </span>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group> */}
        <div className="pt-8 flex justify-between">
          {particularProperty?.isInstantBooking ? (
            <ButtonPrimary>Instant Booking</ButtonPrimary>
          ) : (
            <ButtonPrimary onClick={handleBookingConfirmation}>
              Confirm and Request
            </ButtonPrimary>
          )}
          <ButtonPrimary>Any Queries?</ButtonPrimary>
        </div>
      </div>
      //   </div>
      // </div>
    );
  };

  return (
    <div className={`nc-CheckOutPagePageMain ${className}`}>
      <main className="container mt-11 mb-24 lg:mb-32 flex flex-col-reverse lg:flex-row">
        <div className="w-full lg:w-3/5 xl:w-2/3 lg:pr-10 ">{renderMain()}</div>
        <div className="hidden lg:block flex-grow">{renderSidebar()}</div>
      </main>
    </div>
  );
};

export default CheckOutPagePageMain;
