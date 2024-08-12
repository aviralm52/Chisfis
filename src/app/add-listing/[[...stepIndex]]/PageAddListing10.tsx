"use client";
import StayCard from "@/components/StayCard";
import { DEMO_STAY_LISTINGS } from "@/data/listings";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Route } from "@/routers/types";

import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


import { FaHouseUser } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

export interface PageAddListing10Props {}

interface Page3State {
  portionName: string[];
  portionSize: number[];
  guests: number[];
  bedrooms: number[];
  beds: number[];
  bathroom: number[];
  kitchen: number[];
}

interface Page2State {
  country: string;
  street: string;
  roomNumber: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CombinedData {
  userId?: string;

  propertyType?: string;
  placeName?: string;
  rentalForm?: string;
  numberOfPortions?: number;

  street?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  center?: object;

  portionName?: string[];
  portionSize?: number[];
  guests?: number[];
  bedrooms?: number[];
  beds?: number[];
  bathroom?: number[];
  kitchen?: number[];
  childrenAge?: number[];

  basePrice?: number[];
  weekendPrice?: number[];
  monthlyDiscount?: number[];
  currency?: string;

  generalAmenities?: object;
  otherAmenities?: object;
  safeAmenities?: object;

  smoking?: string;
  pet?: string;
  party?: string;
  cooking?: string;
  additionalRules?: string[];

  reviews?: string[];

  propertyCoverFileUrl?: string;
  propertyPictureUrls?: string[];
  portionCoverFileUrls?: string[];
  portionPictureUrls?: string[][];

  night: number[];
  time: number[];
  datesPerPortion: number[][];

  isLive?: boolean;
}

interface checkBoxState {
  [key: string]: any;
}

const PageAddListing10: FC<PageAddListing10Props> = () => {
  const { user } = useAuth();

  const clearLocalStorage = () => {
    localStorage.removeItem("page1");
    localStorage.removeItem("page2");
    localStorage.removeItem("page3");
    // localStorage.removeItem("page4");
    localStorage.removeItem("page5");
    localStorage.removeItem("page6");
    localStorage.removeItem("page8");
    localStorage.removeItem("page9");
    localStorage.removeItem("propertyCoverFileUrl");
    localStorage.removeItem("propertyPictureUrls");
    localStorage.removeItem("portionCoverFileUrls");
    localStorage.removeItem("portionPictureUrls");
    // localStorage.removeItem("AmenitiesToRetrieve");
    localStorage.removeItem("isImages");
    localStorage.removeItem("isPortionPictures");
    localStorage.removeItem("isPropertyPictures");
  };

  const [propertyCoverFileUrl, setPropertyCoverFileUrl] = useState<string>(
    () => {
      const savedPage = localStorage.getItem("propertyCoverFileUrl") || "";
      return savedPage || "";
    }
  );

  const [page3, setPage3] = useState<Page3State>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (savedPage) {
      return JSON.parse(savedPage);
    }
    return "";
  });

  const [page2, setPage2] = useState<Page2State>(() => {
    const savedPage = localStorage.getItem("page2") || "";
    if (savedPage) {
      return JSON.parse(savedPage);
    }
    return "";
  });

  const [basePrice, setBasePrice] = useState<number>(() => {
    const saved = localStorage.getItem("page8");
    if (!saved) {
      return 0;
    }
    const value = JSON.parse(saved);
    return parseInt(value.basePrice[0]) || 0;
  });

  const [combinedData, setCombinedData] = useState<CombinedData>();

  useEffect(() => {
    const fetchDataFromLocalStorage = () => {
      const page1 = JSON.parse(localStorage.getItem("page1") || "{}");
      const page2 = JSON.parse(localStorage.getItem("page2") || "{}");
      const page3 = JSON.parse(localStorage.getItem("page3") || "{}");
      const page4 = JSON.parse(localStorage.getItem("page4") || "[{}, {}, {}]");
      const page5 = JSON.parse(localStorage.getItem("page5") || "{}");
      const page6 = JSON.parse(localStorage.getItem("page6") || "{}");
      // const page7 = JSON.parse(localStorage.getItem('page7') || '{}');
      const page8 = JSON.parse(localStorage.getItem("page8") || "{}");
      const page9 = JSON.parse(localStorage.getItem("page9") || "{}");

      const propertyPictureUrls = JSON.parse(
        localStorage.getItem("propertyPictureUrls") || "[]"
      );
      const portionCoverFileUrls = JSON.parse(
        localStorage.getItem("portionCoverFileUrls") || "[]"
      );
      const portionPictureUrls = JSON.parse(
        localStorage.getItem("portionPictureUrls") || "[[]]"
      );

      // console.log("page4: ", page4);
      // Combine all the data from the pages
      const combinedData = {
        ...page1,
        ...page2,
        ...page3,
        ...page4,
        ...page5,
        ...page6,
        ...page8,
        ...page9,
        propertyCoverFileUrl,
        propertyPictureUrls,
        portionCoverFileUrls,
        portionPictureUrls,
        userId: user?._id,
      };
      setCombinedData(combinedData);
      return combinedData;
    };

    const data = fetchDataFromLocalStorage();
    // console.log("fetched data: ", data);
  }, [user, propertyCoverFileUrl]);

  const [propertyId, setPropertyId] = useState<string>();
  const [propertyVSID, setPropertyVSID] = useState<string>();

  const handleGoLive = async () => {
    const data = {
      userId: user?._id,
      email:user?.email,
      propertyType: combinedData?.propertyType,
      placeName: combinedData?.placeName,
      rentalForm: combinedData?.rentalForm,
      numberOfPortions: combinedData?.numberOfPortions,

      street: combinedData?.street,
      postalCode: combinedData?.postalCode,
      city: combinedData?.city,
      state: combinedData?.state,
      country: combinedData?.country,
      center: combinedData?.center,

      portionName: combinedData?.portionName,
      portionSize: combinedData?.portionSize,
      guests: combinedData?.guests,
      bedrooms: combinedData?.bedrooms,
      beds: combinedData?.beds,
      bathroom: combinedData?.bathroom,
      kitchen: combinedData?.kitchen,
      childrenAge: combinedData?.childrenAge,

      basePrice: combinedData?.basePrice,
      weekendPrice: combinedData?.weekendPrice,
      monthlyDiscount: combinedData?.monthlyDiscount,
      currency: combinedData?.currency,

      generalAmenities: combinedData?.generalAmenities,
      otherAmenities: combinedData?.otherAmenities,
      safeAmenities: combinedData?.safeAmenities,

      smoking: combinedData?.smoking,
      pet: combinedData?.pet,
      party: combinedData?.party,
      cooking: combinedData?.cooking,
      additionalRules: combinedData?.additionalRules,

      reviews: combinedData?.reviews,

      propertyCoverFileUrl: combinedData?.propertyCoverFileUrl,
      propertyPictureUrls: combinedData?.propertyPictureUrls,
      portionCoverFileUrls: combinedData?.portionCoverFileUrls,
      portionPictureUrls: combinedData?.portionPictureUrls,

      night: combinedData?.night,
      time: combinedData?.time,
      datesPerPortion: combinedData?.datesPerPortion,

      isLive: true,
    };

    try {
      const response = await axios.post("/api/users", data);
      if (data?.userId) {
        toast.success("Property is successfully live!");
        console.log(response.data)
        clearLocalStorage();
      } else {
        toast.error("User must be logged in to go live");
      }
      setPropertyId(response.data._id);
      console.log(response.data.VSID);
      setPropertyVSID(response.data.VSID);
      console.log(response.data.VSID);
    } catch (error) {
      toast.error("User must be logged in to go live");
      throw error;
    }
  };

  return (
    <div className=" flex flex-col gap-12">
      <div>
        <h2 className="text-2xl font-semibold">Congratulations 🎉</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Excellent, congratulations on completing the listing, it is waiting to
          be reviewed for publication
        </span>
      </div>
      <div className="">
        {/* {/ <h3 className="text-lg font-semibold mb-4">This is your listing</h3> /} */}
        {/* <div className="max-w-xs">
          <StayCard
            className="mt-8"
            data={{ ...DEMO_STAY_LISTINGS[0], reviewStart: 0 }}
          />
        </div> */}

        <div className="card w-72 border border-gray-600 rounded-xl pb-2">
          <div className=" h-72 flex justify-center items-center overflow-hidden">
            {propertyCoverFileUrl ? (
              <img
                src={propertyCoverFileUrl}
                alt="coverImage"
                className="card-img-top rounded-xl object-cover"
              />
            ) : (
              <FaHouseUser className=" w-3/4 h-3/4" />
            )}
          </div>
          <div className="card-body mt-2 ml-2">
            <h1 className="mt-2">{page3?.portionName?.[0]}</h1>
          </div>
          <div className="flex gap-2 ml-2 mt-2 items-center">
            {page2?.country && (
              <h6>
                {page2?.city}, {page2?.country}
              </h6>
            )}
          </div>
          <hr className=" w-16 border-gray-600 boder-2 my-2" />
          <div className=" mt-1 font-medium text-xl ml-2">
            {basePrice>0 && <div>€ {basePrice} /night</div>}
          </div>
        </div>

        <div className="flex mt-8 w-2/5 justify-around items-center">
          <ButtonSecondary
            href={"/add-listing/1" as Route}
            className=" dark:bg-slate-700 bg-slate-700 text-white"
          >
            <PencilSquareIcon className="h-3 w-3" />
            <span className="ml-3 text-sm">Edit</span>
          </ButtonSecondary>

          <div>
            {propertyVSID && (
              <Link href={{
                pathname: "/listing-stay-detail",
                query: {
                  id: propertyId,
                }
              }}>
                <ButtonPrimary className="-p-4">
                  <span className="text-sm ">Preview</span>
                </ButtonPrimary>
              </Link>
            )}
          </div>

          <div>
            <ButtonSecondary
              className=" dark:bg-primary-6000 dark:text-white text-slate-700 bg-orange-400"
              onClick={handleGoLive}
            >
              <span className="text-sm">Go Live</span>
            </ButtonSecondary>
          </div>
        </div>
      </div>

      <div className=" flex flex-col">
        {propertyVSID && <div>Your VSID: {propertyVSID}</div>}
        {propertyId && (
          <div className="">
            Your Property Link:{" "}
            {`https://www.vacationsaga.com/listing-stay-detail?id=${propertyId}`}
          </div>
        )}
      </div>
      <ToastContainer className=" w-20 h-20 absolute right-16 top-28" />
  
    </div>
  );
};

export default PageAddListing10;