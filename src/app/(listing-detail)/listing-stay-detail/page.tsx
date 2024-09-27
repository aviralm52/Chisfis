"use client";

import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import CommentListing from "@/components/CommentListing";
import FiveStartIconForRate from "@/components/FiveStartIconForRate";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonClose from "@/shared/ButtonClose";
import Input from "@/shared/Input";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Amenities_demos, PHOTOS } from "./constant";
import StayDatesRangeInput from "./StayDatesRangeInput";
import GuestsInput from "./GuestsInput";
import SectionDateRange from "../SectionDateRange";
import { Route } from "next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import page from "@/app/checkout/page";
import { useSearchParams } from "next/navigation";
import { FaHotTub, FaUser } from "react-icons/fa";
import { IoIosBed, IoIosCompass, IoMdFlame } from "react-icons/io";
import { FaBath } from "react-icons/fa";
import { SlSizeFullscreen } from "react-icons/sl";
import { FaHeart } from "react-icons/fa";
import {
  MdCancel,
  MdConstruction,
  MdHomeWork,
  MdOutlineEnergySavingsLeaf,
} from "react-icons/md";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Property } from "@/models/listing";
import { ObjectId } from "mongodb";
import axios from "axios";
import { CiCalendar } from "react-icons/ci";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import { IoLanguageOutline } from "react-icons/io5";
import { FaRegCheckSquare } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { BsExclamationCircleFill } from "react-icons/bs";
import MobileFooterSticky from "../(components)/MobileFooterSticky";
import { PiStudentBold } from "react-icons/pi";
import { SiLevelsdotfyi } from "react-icons/si";
import { RiMoneyEuroCircleFill } from "react-icons/ri";

// export interface ListingStayDetailPageProps {
//   card: {
//     id: number;
//     title: string;
//     description: string;
//   };
// }
export interface ListingStayDetailPageProps {}

interface Page3State {
  portionName: string[];
  portionSize: number[];
  guests: number[];
  bedrooms: number[];
  beds: number[];
  bathroom: number[];
  kitchen: number[];
}
interface Page8State {
  currency: string;
  isPortion: Boolean;
  basePrice: number[];
  weekendPrice: number[];
  monthlyDiscount: number[];
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface Properties {
  _id: ObjectId;
  userId: string;
  VSID: string;

  propertyType: string;
  placeName: string;
  rentalForm: string;
  numberOfPortions: number;
  rentalType: string;

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
  basePriceLongTerm: number[];
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

  area: string;
  subarea: string;
  neighbourhood: string;
  floor: string;
  isTopFloor: boolean;
  orientation: string;
  levels: number;
  zones: string;
  propertyStyle: string;
  constructionYear: number;
  isSuitableForStudents: boolean;
  monthlyExpenses: number;
  heatingType: string;
  heatingMedium: string;
  energyClass: string;

  night: number[];
  time: number[];
  datesPerPortion: number[][];

  isLive: boolean;
}

// const ListingStayDetailPage: FC<ListingStayDetailPageProps> = ({card}) => {
const ListingStayDetailPage: FC<ListingStayDetailPageProps> = () => {
  const { user } = useAuth();

  const router = useRouter();

  const thisPathname = usePathname();
  const searchParams = useSearchParams();

  const param: string = searchParams.get("id") || "0";
  const paramInt: number = parseInt(param, 10);
  const indexId: number = paramInt >= 0 && paramInt <= 10 ? paramInt : 0;

  const [particularProperty, setParticualarProperty] = useState<Properties>();
  const [allImages, setAllImages] = useState<any[]>([]);

  const [propertyId, setPropertyId] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const [userIdOfPorperty, setUserIdOfProperty] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [allAmenities, setAllAmenities] = useState<any[]>([]);
  const [propertyPortions, setPropertyPortions] = useState<number>(0);

  useEffect(() => {
    const getProperties = async () => {
      try {
        const response = await axios.get(`/api/particular/${indexId}`);
        if (response.data) {
          setParticualarProperty(response?.data);
          setUserIdOfProperty(response.data.userId);
          setPropertyId(response.data._id);
          setPropertyPortions(response?.data?.portionName.length);
        }

        const languageResponse = await axios.get(
          `https://restcountries.com/v3.1/name/${response?.data?.country}`
        );
        const languageKey = Object.keys(
          languageResponse?.data[0]?.languages
        )[0];
        const lang = languageResponse?.data[0]?.languages[languageKey];
        setLanguage(lang);
        const allAmen = [];
        const general = Object.entries(response?.data?.generalAmenities);
        const safe = Object.entries(response?.data?.safeAmenities);
        const other = Object.entries(response?.data?.otherAmenities);
        allAmen.push(...general, ...safe, ...other);
        const filteredAllAmen = allAmen.filter(
          (item, index) => item[1] === true
        );
        setAllAmenities(filteredAllAmen);
      } catch (err) {
        console.log("error: ", err);
      }
    };
    getProperties();
  }, []);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const response = await axios.get(
          `/api/getUsername/${userIdOfPorperty}`
        );
        if (response.data) {
          const tempName = response.data.name;
          const name = tempName.charAt(0).toUpperCase() + tempName.slice(1);
          setUsername(name);
        }
      } catch (err) {
        console.log("error: ", err);
      }
    };
    getUsername();
  }, [userIdOfPorperty]);

  let portions = 0;
  const data = localStorage.getItem("page1") || "";
  if (data) {
    const value = JSON.parse(data)["numberOfPortions"];
    if (value) {
      portions = parseInt(value, 10);
    }
  }
  let checkPortion = portions > 1 ? portions : 0;
  const [myArray, setMyArray] = useState<number[]>(Array(checkPortion).fill(1));

  const [page8, setPage8] = useState<Page8State>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (savedPage) {
      return JSON.parse(savedPage);
    }
    return "";
  });

  const [page3, setPage3] = useState<Page3State>(() => {
    const savedPage = localStorage.getItem("page3") || "";
    if (savedPage) {
      return JSON.parse(savedPage);
    }
    return "";
  });

  const [price, setPrice] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (savedPage) {
      const value = JSON.parse(savedPage);
      return value.basePrice;
    }
    return [0, 0];
  });

  const [selectedDates, setSelectedDates] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const handleDatesChange = (dates: DateRange) => {
    setSelectedDates(dates);
  };

  const [savedDates, setSavedDates] = useState<Date[]>(() => {
    const saved = localStorage.getItem("dates") || "";
    if (saved) {
      const value = JSON.parse(saved);
      const start = new Date(value.startDate);
      const end = new Date(value.endDate);
      // return [value.startDate, value.endDate];
      return [start, end];
    }
    const today = new Date();
    return [today, today];
  });

  const [minNights, setMinNights] = useState<number>(1);
  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  useEffect(() => {
    const newMinNights = particularProperty?.night[0] ?? 1;
    setMinNights(newMinNights);

    if (savedDates[0] && savedDates[1]) {
      const calculatedNights = Math.ceil(
        (savedDates[1].getTime() - savedDates[0].getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setNumberOfNights(Math.max(calculatedNights, newMinNights));
    } else {
      setNumberOfNights(newMinNights);
    }
  }, [savedDates, particularProperty?.night]);

  const [portionCoverFileUrls, setPortionCoverFileUrls] = useState<string[]>(
    Array(checkPortion).fill("")
  );

  useEffect(() => {
    const savedData = localStorage.getItem("portionCoverFileUrls") || "";
    if (!savedData) {
      setPortionCoverFileUrls(Array(checkPortion).fill(1));
    } else {
      const value = JSON.parse(savedData);
      setPortionCoverFileUrls(value);
    }
  }, [checkPortion]);

  let [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  const [location, setLocation] = useState<string[]>(() => {
    const savedPage = localStorage.getItem("page2") || "";
    if (savedPage) {
      const value = JSON.parse(savedPage);
      return [
        value.country,
        value.state,
        value.city,
        value.postalCode,
        value.street,
        value.roomNumber,
      ];
    }
    return ["", "", "", "", "", ""];
  });

  const renderSection1 = () => {
    return (
      <div className="  lg:border lg:border-neutral-700 rounded-xl lg:p-2">
        <div className="flex justify-between items-center lg:mt-2">
          <Badge name={particularProperty?.propertyType} />
          <Badge name={particularProperty?.VSID} />
          {particularProperty?.rentalType === "Long Term" &&
            (particularProperty?.isTopFloor ? (
              <Badge name={"Top Floor"} />
            ) : (
              <Badge name={`Floor ${particularProperty?.floor}`} />
            ))}
          {particularProperty?.rentalType === "Long Term" && (
            <Badge name={`${particularProperty.propertyStyle}`} />
          )}
          <LikeSaveBtns />
        </div>

        {/* 2 */}
        <h2 className="text-xl sm:text-3xl mt-2 lg:text-4xl lg:mt-4 font-semibold">
          VS ID - {particularProperty?.VSID}
        </h2>

        {/* 3 */}
        <div className=" flex items-center space-x-4 lg:my-2">
          {/* <StartRating /> */}
          <span className="text-sm my-2 lg:text-lg flex items-center">
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1 text-xs lg:text-lg">
              {particularProperty?.city} {particularProperty?.country}
            </span>
          </span>
          <span> - </span>
          {particularProperty?.rentalType === "Long Term" && (
            <span className="text-sm my-2 lg:text-lg flex items-center">
              <span className="text-xs lg:text-sm">
                {particularProperty?.area} of {particularProperty?.subarea},{" "}
                {particularProperty?.neighbourhood},{" "}
                {particularProperty?.postalCode}
              </span>
            </span>
          )}
        </div>

        <div className="flex  items-center lg:my-4">
          <img
            src={
              "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yaWRMcmd4Q01COGJuRWQ2bUl1V3R0dEtzaXkiLCJyaWQiOiJ1c2VyXzJqOHhkb0R5cUl4V05adXFlcWlXTlpsdGpwMiJ9"
            }
            alt="user"
            className=" rounded-full w-8"
          />
          <span className="ml-2.5 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            Hosted by
            <span className="text-neutral-900 mr-2 dark:text-neutral-200 font-medium ml-2 ">
              {username}
            </span>
          </span>
        </div>

        <div className="w-full border-b border-neutral-100 mt-2 mb-2 dark:border-neutral-700" />

        {/* 6 */}

        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center space-x-3 ">
            <FaUser className="text-2xl" />
            {/* <h3 className=" text-sm">{page3.guests[indexId]} Guests</h3> */}
            <h3 className=" flex gap-x-1 text-sm">
              {particularProperty?.guests[indexId] || 3}{" "}
              <span className="sm:block hidden">Guests</span>
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <IoIosBed className="text-2xl" />
            {/* <h3 className=" text-sm">{page3.bedrooms[indexId]} Bedrooms</h3> */}
            <h3 className=" flex gap-x-1 text-sm">
              {particularProperty?.bedrooms[indexId]}{" "}
              <span className="sm:block hidden">Bedrooms</span>
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <FaBath className="text-2xl" />
            {/* <h3 className=" text-sm">{page3.bathroom[indexId]} Bathroom</h3> */}
            <h3 className=" flex gap-x-1 text-sm">
              {particularProperty?.bathroom[indexId]}{" "}
              <span className="sm:block hidden">Bathroom</span>
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <SlSizeFullscreen className="text-2xl" />
            {/* <h3 className=" text-sm">{page3.portionSize[indexId]} sq</h3> */}
            <h3 className=" flex gap-x-1 text-sm">
              {particularProperty?.portionSize[indexId]}{" "}
              <span className="sm:block hidden">sq</span>
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <IoIosCompass className="text-2xl" />
            <h3 className=" flex gap-x-1 text-sm">
              {particularProperty?.orientation}
            </h3>
          </div>
        </div>
      </div>
    );
  };

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [description, setDescription] = useState<string[]>(() => {
    const savedPage = localStorage.getItem("page6") || "";
    if (savedPage) {
      const value = JSON.parse(savedPage);
      return value.reviews;
    }
    const emptyArray = Array(portions).fill("");
    return emptyArray;
  });

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap ">
        <div className=" z-50 ">
          <MobileFooterSticky
            price={particularProperty?.basePrice[0]}
            nights={particularProperty?.night[0] || 3}
          />
        </div>
        <h2 className="text-2xl font-semibold  mb-2">Stay information</h2>
        {particularProperty?.reviews[indexId]}
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Amenities </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {` About the property's amenities and services`}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {allAmenities
            .filter((_, i) => i < 12)
            .map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                {/* <i className={`text-3xl las ${item.icon}`}></i> */}
                <FaCheck className=" text-2xl" />
                {/* <span className=" ">{item.name}</span> */}
                <span>{item[0]}</span>
              </div>
            ))}
        </div>

        {/* ----- */}
        <div className="w-14 border-b border-neutral-200"></div>
        <div>
          <ButtonSecondary onClick={openModalAmenities}>
            View more amenities
          </ButtonSecondary>
        </div>
        {renderMotalAmenities()}
      </div>
    );
  };

  const renderMotalAmenities = () => {
    return (
      <Transition appear show={isOpenModalAmenities} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-screen w-full max-w-4xl">
                <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="headlessui-dialog-title-70"
                    >
                      Amenities
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalAmenities} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {/* Amenities_demos.filter */}
                    {allAmenities.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8"
                      >
                        <FaCheck className=" text-2xl" />
                        <span>{item[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Room Rates </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Prices may increase on weekends or holidays
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* CONTENT */}
        <div className="flow-root">
          <div className="text-sm sm:text-base text-neutral-6000 dark:text-neutral-300 -mb-4">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
              {particularProperty?.rentalType === "Short Term" ? (
                <span>Monday - Thursday</span>
              ) : (
                <span>Monthly Rates</span>
              )}
              {/* <span>€ {price[indexId]}</span> */}
              <span>
                €{" "}
                {particularProperty?.rentalType === "Short Term"
                  ? particularProperty?.basePrice[indexId]
                  : particularProperty?.basePriceLongTerm[0]}
              </span>
            </div>

            {particularProperty?.rentalType === "Short Term" && (
              <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
                <span>Friday - Sunday</span>
                {/* <span>€ {page8.weekendPrice[indexId]}</span> */}
                <span>€ {particularProperty?.weekendPrice[indexId]}</span>
              </div>
            )}

            {particularProperty?.rentalType === "Short Term" ? (
              <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
                <span>Weekly Discount</span>{" "}
                <span>{particularProperty?.monthlyDiscount[indexId]}</span>
              </div>
            ) : (
              <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
                {" "}
                <span>Monthly Discount</span>
                <span>- {particularProperty?.monthlyDiscount[indexId]} % </span>
              </div>
            )}

            {particularProperty?.rentalType === "Short Term" && (
              <div>
                {" "}
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
                  <span>Minimum number of nights</span>
                  <span>{particularProperty?.night[0]} nights</span>
                </div>
                <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
                  <span>Max number of nights</span>
                  <span>{particularProperty?.night[1]} nights</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Host Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* host */}
        <div className="flex items-center space-x-4">
          {/* <Avatar
            hasChecked
            hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
            sizeClass="h-14 w-14"
            radius="rounded-full"
          /> */}
          {/* <img src={user.imageUrl} alt="user" className=" rounded-full w-8" /> */}
          <img
            src={
              "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yaWRMcmd4Q01COGJuRWQ2bUl1V3R0dEtzaXkiLCJyaWQiOiJ1c2VyXzJqOHhkb0R5cUl4V05adXFlcWlXTlpsdGpwMiJ9"
            }
            alt="user"
            className=" rounded-full w-8"
          />
          <div>
            <a className="block text-xl font-medium" href="##">
              {/* Kevin Francis  */}
              {username}
            </a>
          </div>
        </div>

        <div className="mt-1.5 flex flex-col text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <CiCalendar className="mt-1 text-lg md:text-xl" />
            <span className="mb-3 text-sm md:text-base">
              Joined long time ago
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <BiMessageAltDetail className="mt-1 text-lg md:text-xl" />
            <span className="mb-3 text-sm md:text-base">
              Response rate - 100%
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <FaRegClock className="mt-1 text-lg md:text-xl" />
            <span className="mb-3 text-sm md:text-base">
              Fast response - within a few hours
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <IoLanguageOutline className="mt-1 text-lg md:text-xl" />
            <span className="mb-3 text-sm md:text-base">
              Language spoken - English, {language}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Reviews (23 reviews)</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Content */}
        <div className="space-y-5">
          <FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
          <div className="relative">
            <Input
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Share your thoughts ..."
            />
            <ButtonCircle
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size=" w-12 h-12 "
            >
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </div>
        </div>

        {/* comment */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <div className="pt-8">
            <ButtonSecondary>View more 20 reviews</ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {/* {location[2]}, {location[1]}, {location[0]} */}
            {particularProperty?.city}, {particularProperty?.state},{" "}
            {particularProperty?.country}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* MAP */}
        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3 ring-1 ring-black/10 rounded-xl z-0">
          <div className="rounded-xl overflow-hidden z-0">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY&q=Eiffel+Tower,Paris+France"
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  const [time, setTime] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page9") || "";
    if (!savedPage) {
      return [10, 12];
    }
    const value = JSON.parse(savedPage)["time"];
    return value || [10, 12];
  });

  const [additionalRules, setAdditionalRules] = useState<string[]>(() => {
    const savedPage = localStorage.getItem("page5") || "";
    if (!savedPage) {
      return [];
    }
    const value = JSON.parse(savedPage)["additionalRules"];
    return value || [];
  });

  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Things to know</h2>

        {/* CONTENT */}
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Check-in time</h4>
          <div className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-md text-sm sm:text-base">
            <div className="flex space-x-10 justify-between p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <span>Check-in</span>
              {/* <span>{time[0]}:00 am</span> */}
              <span>{particularProperty?.time[0]}:00 am</span>
            </div>
            <div className="flex space-x-10 justify-between p-3">
              <span>Check-out</span>
              {/* <span>{time[1]}:00 pm</span> */}
              <span>{particularProperty?.time[1]}:00 pm</span>
            </div>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* LONG TERM INFO */}

        {particularProperty?.rentalType === "Long Term" && (
          <div className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
            <div className=" md:flex justify-between w-full">
              <div className=" flex items-center gap-x-2 w-3/5">
                <SiLevelsdotfyi />
                Number of Levels: {particularProperty?.levels}
              </div>
              <div className=" flex items-center justify-start gap-x-2 w-2/5">
                <MdHomeWork />
                Zones: {particularProperty?.zones}
              </div>
            </div>
            <div className=" md:flex justify-between w-full">
              <div className=" flex items-center gap-x-2 w-3/5">
                <PiStudentBold />
                This property is{" "}
                {particularProperty?.isSuitableForStudents ? "" : "not"}{" "}
                suitable for students
              </div>
              <div className=" flex items-center gap-x-2 w-2/5">
                <MdConstruction />
                Construction Year: {particularProperty?.constructionYear}
              </div>
            </div>
            <div className=" md:flex justify-between w-full">
              <div className=" flex items-center gap-x-2 w-3/5">
                <RiMoneyEuroCircleFill />
                Expected Monthly Expenses: {particularProperty?.monthlyExpenses}
              </div>
              <div className=" flex items-center gap-x-2 w-2/5">
                {" "}
                <FaHotTub />
                Type of Heating: {particularProperty?.heatingType}
              </div>
            </div>
            <div className=" md:flex justify-between w-full">
              <div className=" flex items-center gap-x-2 w-3/5">
                {" "}
                <IoMdFlame />
                Heating Medium: {particularProperty?.heatingMedium}
              </div>
              <div className=" flex items-center gap-x-2 w-2/5">
                {" "}
                <MdOutlineEnergySavingsLeaf /> Energy Class:{" "}
                {particularProperty?.energyClass}
              </div>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Special Note</h4>
          <div className="prose sm:prose">
            <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
              {particularProperty?.additionalRules.map((rule, index) => {
                return <li key={index}>{rule}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const [totalGuests, setTotalGuests] = useState<number>(() => {
    const savedValue = localStorage.getItem("totalGuests") || "";
    if (savedValue) {
      const total = JSON.parse(savedValue);
      return total;
    }
    return 0;
  });
  const handleGuestChange = (totalGuests: number) => {
    setTotalGuests(totalGuests);
  };

  const [minNightStay, setMinNightStay] = useState<number | undefined>(
    undefined
  );
  const renderSidebar = () => {
    const handleDatesChange = (dates: {
      startDate: Date | null;
      endDate: Date | null;
    }) => {
      const { startDate, endDate } = dates;
      const nights = calculateDateDifference(startDate, endDate);
      // setTempNight(nights);
      setMinNightStay(nights);
      setNumberOfNights(Math.max(nights, minNights));
    };

    const calculateDateDifference = (start: Date | null, end: Date | null) => {
      if (start && end) {
        const timeDiff = end.getTime() - start.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Adding 1 to include both start and end dates
      }
      return 0;
    };

    // const basePrice = particularProperty?.basePrice[indexId] ?? 0;
    const basePrice =
      particularProperty?.rentalType === "Short Term"
        ? particularProperty?.basePrice[indexId]
        : particularProperty?.basePriceLongTerm[0] || 0;
    const nights = Math.max(numberOfNights, minNights);
    const totalPrice =
      particularProperty?.rentalType === "Short Term"
        ? basePrice * nights
        : particularProperty?.basePriceLongTerm[0] || 0;

    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            € {basePrice}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /
              {particularProperty?.rentalType === "Short Term"
                ? "night"
                : "month"}
            </span>
          </span>
          <StartRating />
        </div>

        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl">
          <StayDatesRangeInput
            className="flex-1 z-[11]"
            onDatesChange={handleDatesChange}
            minNights={minNights}
          />
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInput
            className="flex-1"
            onGuestsChange={handleGuestChange}
            totalNumberOfGuests={particularProperty?.guests[0]}
          />
        </form>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span className=" flex gap-x-1">
              € {basePrice} *{" "}
              {particularProperty?.rentalType === "Short Term" ? (
                <div>
                  {minNightStay === undefined
                    ? particularProperty?.night[0]
                    : minNightStay}{" "}
                  nights
                </div>
              ) : (
                <div>1 month</div>
              )}
            </span>
            <span>€ {totalPrice}</span>
          </div>

          <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
            <span>Service charge</span>
            <span>€ 6</span>
          </div>

          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>€ {totalPrice + 6} </span>
          </div>
        </div>

        <Link
          href={{
            pathname: "/checkout",
            query: {
              id: propertyId,
            },
          }}
        >
          <ButtonPrimary>Reserve</ButtonPrimary>
        </Link>
      </div>
    );
  };

  const [clicked, setClicked] = useState<boolean[]>(
    Array(portions).fill(false)
  );

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Adjust the number of cards to show at once
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Custom Arrow Components
  function SampleNextArrow(props: any) {
    const { className, onClick } = props;
    return (
      <div
        className={`${className} slick-next`}
        onClick={onClick}
        style={{ display: "block", right: "10px" }}
      />
    );
  }

  function SamplePrevArrow(props: any) {
    const { className, onClick } = props;
    return (
      <div
        className={`${className} slick-prev z-10`}
        onClick={onClick}
        style={{ display: "block", left: "10px" }}
      />
    );
  }

  const renderPortionCards = () => {
    return (
      <div className=" flex gap-4 property-carousel-container">
        <Slider {...settings} className="w-full">
          {Array.from({ length: propertyPortions }, () => 1).map(
            (item, index) => (
              <div
                className=" border border-gray-600 rounded-xl overflow-hidden cursor-pointer"
                key={index}
              >
                <Link
                  href={{
                    pathname: `/listing-stay-detail`,
                    query: {
                      id: propertyId,
                      portion: index,
                    },
                  }}
                >
                  <div className=" lg:h-48 md:h-44 sm:h-40 w-full">
                    {particularProperty?.portionCoverFileUrls[index] ? (
                      <img
                        src={particularProperty?.portionCoverFileUrls[index]}
                        alt="Portion Image"
                        className="cover w-full object-fill h-full rounded-xl hover:opacity-60"
                      />
                    ) : (
                      <div className=" w-full h-full flex flex-col justify-center items-center">
                        <BsExclamationCircleFill className=" w-1/4 h-1/4 mb-2 text-neutral-600" />
                        <span className=" text-neutral-600 font-medium">
                          Image not found
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className=" flex gap-4 justify-center items-center my-2">
                  <div className=" flex items-center gap-2 ">
                    <h2 className=" text-sm">
                      {particularProperty?.beds[index]}
                    </h2>{" "}
                    <IoIosBed className="text-md" />
                  </div>
                  <div className=" flex items-center gap-2 ">
                    <h2 className=" text-sm">
                      {particularProperty?.bathroom[index]}
                    </h2>{" "}
                    <FaBath className="text-md" />
                  </div>
                  <div className=" flex items-center gap-2 ">
                    <h2 className=" text-sm">
                      {particularProperty?.guests[index]}
                    </h2>{" "}
                    <FaUser className="text-md" />
                  </div>
                  <div className=" flex items-center gap-2 ">
                    <h2 className=" text-sm">
                      {particularProperty?.portionSize[index]} sq
                    </h2>{" "}
                    <SlSizeFullscreen className="text-md" />
                  </div>
                </div>
                <div className=" px-2 py-4">
                  <h2 className=" font-semibold text-xl">
                    Portion {index + 1}
                  </h2>
                  <p className=" text-lg font-medium">
                    € {particularProperty?.basePrice[index]}/night
                  </p>
                </div>
              </div>
            )
          )}
        </Slider>
      </div>
    );
  };

  const allImagesParam: string = searchParams.get("allImages") || "";
  const imageCarousel = () => {
    return (
      <Carousel>
        {allImages
          .filter((_, i) => i >= 1)
          .map((item, index) => (
            <div key={index}>
              <img
                src={item}
                alt="Carousel Image"
                className="w-16 h-80 rounded-xl"
              />
            </div>
          ))}
      </Carousel>
    );
  };

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const modalImages = () => {
    return (
      <Transition appear show={modalIsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setModalIsOpen(false)}
        >
          <div className="min-h-screen px-4 text-center flex items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="w-3/4 max-w-4xl h-4/5 bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl rounded-2xl overflow-hidden flex flex-col">
                <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="headlessui-dialog-title-70"
                  >
                    Images
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={() => setModalIsOpen(false)} />
                  </span>
                </div>
                <div className="flex-grow overflow-auto px-8 py-4 text-neutral-700 dark:text-neutral-300">
                  <div className="flex flex-wrap gap-4 justify-center lg:gap-12">
                    {allImages
                      .filter((_, i) => i >= 1 && i < 1212) // Assuming this is to limit the number of images displayed
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center py-2.5 space-x-5"
                        >
                          <div className="rounded-xl border border-slate-700">
                            <a href={item} target="_blank">
                              <img
                                src={
                                  item ||
                                  "https://cdn.pixabay.com/photo/2013/07/12/12/56/home-146585_1280.png"
                                }
                                alt=""
                                className="w-64 h-64 rounded-xl lg:w-72 lg:h-72"
                              />
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const [propertyPicturesTemp, setPropertyPicturesTemp] = useState<string[]>(
    []
  );
  useEffect(() => {
    if (particularProperty?.propertyPictureUrls) {
      setPropertyPicturesTemp(particularProperty?.propertyPictureUrls);
    }
  }, [particularProperty?.propertyPictureUrls]);

  useEffect(() => {
    if (
      particularProperty?.propertyCoverFileUrl &&
      particularProperty?.propertyPictureUrls &&
      particularProperty?.portionCoverFileUrls &&
      particularProperty?.portionPictureUrls
    ) {
      const allImagesArray = [
        particularProperty?.portionCoverFileUrls,
        particularProperty?.propertyPictureUrls,
        particularProperty?.portionCoverFileUrls,
        particularProperty?.portionPictureUrls,
      ];
      const arr = allImagesArray
        .flat(Infinity)
        .filter((item) => item !== null && item !== "");

      setAllImages(arr);
    }
  }, [
    particularProperty?.propertyCoverFileUrl,
    particularProperty?.propertyPictureUrls,
    particularProperty?.portionCoverFileUrls,
    particularProperty?.portionPictureUrls,
  ]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    // <ProtectedRoute>
    <div
      className={`nc-ListingStayDetailPage ${modalIsOpen ? "blur-md" : ""} `}
    >
      <header className="rounded-md sm:rounded-xl">
        {/* Main Grid Layout for larger screens */}
        <div className="relative  hidden  w-full h-full md:grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
          <div className="col-span-2  row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden">
            {particularProperty?.propertyCoverFileUrl ? (
              <img
                src={
                  particularProperty?.propertyCoverFileUrl ||
                  "https://cdn.pixabay.com/photo/2013/07/12/12/56/home-146585_1280.png"
                }
                alt="Cover Image"
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <BsExclamationCircleFill className="w-1/4 h-1/4 mb-2 text-neutral-600" />
                <span className="text-neutral-600 font-medium">
                  Image not found
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail images for larger screens */}
          {propertyPicturesTemp
            .filter((_, i) => i >= 1 && i < 5)
            .map((item, index) => (
              <div
                className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5 rounded-xl"
                key={index}
              >
                <img
                  src={
                    propertyPicturesTemp[index] ||
                    "https://cdn.pixabay.com/photo/2013/07/12/12/56/home-146585_1280.png"
                  }
                  alt="Property Picture"
                  className="object-cover rounded-xl sm:rounded-xl w-44 h-44"
                />
              </div>
            ))}
          <button
            className="absolute flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 z-30"
            onClick={() => setModalIsOpen(true)}
          >
            <Squares2X2Icon className="w-5 h-5" />
            <span className="ml-2 text-neutral-800 text-sm font-medium">
              Show all photos
            </span>
          </button>
        </div>

        <div className="block md:hidden  w-full mt-4">
          <Slider {...carouselSettings}>
            {[particularProperty?.propertyCoverFileUrl, ...propertyPicturesTemp]
              .filter((url, i) => i >= 0 && i < 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5 rounded-xl"
                >
                  <img
                    src={
                      item ||
                      "https://cdn.pixabay.com/photo/2013/07/12/12/56/home-146585_1280.png"
                    }
                    alt="Property Picture"
                    className="object-cover rounded-xl sm:rounded-xl w-full h-full"
                  />
                </div>
              ))}
          </Slider>
          <button
            className=" flex mt-10 text-xs items-center gap-x-2 md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 z-10"
            onClick={() => setModalIsOpen(true)}
          >
            <Squares2X2Icon className="w-5 h-5" />
            Show all photos
          </button>
        </div>
      </header>

      {modalIsOpen ? modalImages() : ""}

      {/* MAIN */}
      <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {renderSection4()}
          <SectionDateRange />
          {propertyPortions > 1 && renderPortionCards()}
          {renderSection5()}
          {/* {renderSection6()} */}
          {/* {renderSection7()} */}
          {renderSection8()}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>
    </div>
    // </ProtectedRoute>
  );
};

export default ListingStayDetailPage;
