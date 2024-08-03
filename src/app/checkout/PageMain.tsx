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
import ModalSelectDate from "@/components/ModalSelectDate";
import converSelectedDateToString from "@/utils/converSelectedDateToString";
import ModalSelectGuests from "@/components/ModalSelectGuests";
import Image from "next/image";
import { GuestsObject } from "../(client-components)/type";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { ObjectId } from "mongodb";
import { end } from "@cloudinary/url-gen/qualifiers/textAlignment";
import { start } from "repl";

export interface CheckOutPagePageMainProps {
  className?: string;
}

interface Properties {
  _id: ObjectId;
  userId: string;
  VSID: string;

  propertyType: string;
  placeName: string;
  rentalForm: string;
  numberOfPortions: number;

  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  center: object;

  portionName: string[];
  portionSize: number[];
  guests: number[];
  bedrooms: number[];
  beds: number[];
  bathroom: number[];
  kitchen: number[];
  childrenAge: number[];

  basePrice: number[];
  weekendPrice: number[];
  monthlyDiscount: number[];
  currency: string;

  generalAmenities: object;
  otherAmenities: object;
  safeAmenities: object;

  smoking: string;
  pet: string;
  party: string;
  cooking: string;
  additionalRules: string[];

  reviews: string[];

  propertyCoverFileUrl: string;
  propertyPictureUrls: string[];
  portionCoverFileUrls: string[];
  portionPictureUrls: string[][];

  night: number[];
  time: number[];
  datesPerPortion: number[][];

  isLive: boolean;
}

const CheckOutPagePageMain: FC<CheckOutPagePageMainProps> = ({
  className = "",
}) => {
  const [reservedDates, setReservedDates] = useState<Date[]>(() => {
    const savedDates =
      localStorage.getItem("dates") || JSON.stringify(Date.now());
    if (!savedDates) {
      return [Date.now(), Date.now()];
    }
    const dates = JSON.parse(savedDates);
    return [dates.startDate, dates.endDate];
  });

  const searchParams = useSearchParams();
  const param: string = searchParams.get("id") || "0";
  const paramInt: number = parseInt(param, 10);

  const [particularProperty, setParticualarProperty] = useState<Properties>();

  useEffect(() => {
    const getProperty = async () => {
      const response = await axios.get(`/api/particular/${paramInt}`);
      if (response.data) {
        setParticualarProperty(response?.data);
      }
    };

    getProperty();
  }, []);

  // const [startDate, setStartDate] = useState<Date | null>(
  //   new Date("2023/02/06")
  // );
  // const [endDate, setEndDate] = useState<Date | null>(new Date("2023/02/23"));

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
    console.log('called use effect for diff');
    const diff = calculateDifferenceBetweenDates(startDate, endDate);
    setDateDiff(diff);
  }, [startDate, endDate]);

  useEffect(() => {
    console.log('called use effect for date');
    const savedDates = JSON.stringify({
      startDate: startDate,
      endDate: endDate,
    });
    setStartDate(startDate);
    setEndDate(endDate);
    localStorage.setItem("dates", savedDates);
  }, [startDate, endDate]);

  // const [guests, setGuests] = useState<GuestsObject>({
  //   guestAdults: 3,
  //   guestChildren: 0,
  //   guestInfants: 0,
  // });

  const [guests, setGuests] = useState<GuestsObject>(() => {
    const savedGuests = localStorage.getItem("guestsState");
    if (!savedGuests) {
      return { guestAdults: 3, guestChildren: 0, guestInfants: 0 };
    }
    const gsts = JSON.parse(savedGuests);
    return {
      guestAdults: gsts.adutls,
      guestChildren: gsts.childen,
      guestInfants: gsts.infants,
    };
  });


  const handleLocalStorageChange = () => {
    const savedDates = localStorage.getItem("dates");
    if (!savedDates) {
      return startDate;
    }
    const dates = JSON.parse(savedDates);
    setStartDate(new Date(dates.startDate));
    setEndDate(new Date(dates.endDate));

    const savedGuests = localStorage.getItem("guests");
    if (!savedGuests) {
      return guests;
    }
    const gsts = JSON.parse(savedGuests);
    setGuests({
      guestAdults: gsts.guestAdults,
      guestChildren: gsts.guestChildren,
      guestInfants: gsts.guestInfants,
    });
  };
  window.addEventListener("storage", handleLocalStorageChange);

  const renderSidebar = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl lg:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex-shrink-0 w-full sm:w-40">
            <div className=" aspect-w-4 aspect-h-3 sm:aspect-h-4 rounded-2xl overflow-hidden">
              {/* <Image
                alt=""
                fill
                sizes="200px"
                src="https://images.pexels.com/photos/6373478/pexels-photo-6373478.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              /> */}
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
              {particularProperty?.bedrooms[0]} beds ·{" "}
              {particularProperty?.bathroom[0]} bath
            </span>
            <div className="w-10 border-b border-neutral-200  dark:border-neutral-700"></div>
            <StartRating />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Price detail</h3>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>
              € {particularProperty?.basePrice[0]} x{" "}
              {calculateDifferenceBetweenDates(startDate, endDate)} day
            </span>
            <span>
              € {(particularProperty?.basePrice[0] || 100) * dateDiff}
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
              € {dateDiff * (particularProperty?.basePrice[0] || 100) + 6}{" "}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderMain = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-8 px-0 sm:p-6 xl:p-8">
        <h2 className="text-3xl lg:text-4xl font-semibold">
          Confirm and payment
        </h2>
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
              renderChildren={({ openModal }) => (
                <button
                  onClick={openModal}
                  className="text-left flex-1 p-5 flex justify-between space-x-5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  type="button"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-400">Date</span>
                    <span className="mt-1.5 text-lg font-semibold">
                      {converSelectedDateToString([startDate, endDate])}
                    </span>
                  </div>
                  <PencilSquareIcon className="w-6 h-6 text-neutral-6000 dark:text-neutral-400" />
                </button>
              )}
            />

            <ModalSelectGuests
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
                        {/* {`${
                          (guests.guestAdults || 0) +
                          (guests.guestChildren || 0)
                        } Guests, ${guests.guestInfants || 0} Infants`} */}
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
          <ButtonPrimary href={"/pay-done"}>Confirm and pay</ButtonPrimary>
          <ButtonPrimary href={"/pay-done"}>Any Queries?</ButtonPrimary>
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
