"use client";

import React, { FC, ReactNode, useState, useEffect } from "react";
import { RiLoader2Line } from "react-icons/ri";
import axios from "axios";
import { ObjectId } from "mongoose";
import { StayDataType } from "@/data/types";
import StayCard from "@/components/StayCard";
import CustomStayCard from "./CustomStayCard";
import { useSearchParams } from "next/navigation";
import FilterCard from "./FilterCard";
import TabFilters from "../(stay-listings)/TabFiltersTwo"
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";

interface Properties {
  _id: string;
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

export interface SectionGridFeaturePlacesProps {
  stayListings?: StayDataType[];
  gridClass?: string;
  cardType?: "card1" | "card2";
  value?: string;
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  stayListings,
  value,
  gridClass = "",
  cardType = "card2",
}) => {
  const [dataLength, setDataLength] = useState(0);
  const [fetchedData, setFetchedData] = useState<Properties[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  // const [filterProperties, setFilterProperties] = useState<Properties[]>([]);

  const [data, setData] = useState<Properties[]>([]);
  const recordPerPage = 20;

  const params = useSearchParams();
  const country = params.get("place") || "Greece";

  // TODO:  Api call state goes here

  const [rentalForm, setRentalForm] = useState<string>();
  const [propertyType, setPropertyType] = useState<string>();
  const [beds, setBeds] = useState<number>(0);
  const [bedrooms, setBedRooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [minPrice , setMinPrice] = useState<number>(0);
  const [maxPrice , setMaxPrice] = useState<number>(999999999);




  const fetchProperties = async () => {
    console.log("use effect called");
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/countryspecificproperties/${country}`
      );
      setDataLength(response.data.length);
      setData(response.data);
      console.log("data from sectionGridFeaturePlaces: ", response?.data);
      setLoading(false);
      setFetchedData(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);


  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = fetchedData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(dataLength / recordPerPage);

  const handlefilters = async () => {
    setLoading(true);
    console.log(
      "handlefilter called",
      rentalForm,
      propertyType,
      beds,
      bedrooms,
      bathrooms,
      minPrice,
      maxPrice,
      country
    );
    const response = await axios.post("api/filters", {
      rentalForm,
      propertyType,
      beds,
      bedrooms,
      bathrooms,
      minPrice,
      maxPrice,
      country
    });
    if (response.data) {
      setData(response.data);
      setLoading(false)
      console.log(response.data);
    } else {
      console.log("no data");
      setLoading(false)
    }
  };

  const getPaginationNumbers = () => {
    const maxVisiblePages = 5;
    const startPage = Math.max(
      currentPage - Math.floor(maxVisiblePages / 2),
      1
    );
    const endPage = Math.min(startPage + maxVisiblePages - 1, npage);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCpage = (id: number) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="nc-SectionGridFeaturePlaces  relative ">
      <div className="flex items-center justify-between">
        <div>
          <TabFilters
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            setBathrooms={setBathrooms}
            setBedRooms={setBedRooms}
            setBeds={setBeds}
            setPropertyType={setPropertyType}
            setRentalForm={setRentalForm}
          />
        </div>

        <div className="flex gap-x-2">
          <ButtonPrimary onClick={handlefilters}>Apply</ButtonPrimary>
          <ButtonThird onClick={fetchProperties} >Clear</ButtonThird>
        </div>
      </div>

      <div
      className={`grid p-12 mb-3 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
    >
      {loading ? (
        <div className="flex items-center justify-center w-[80vw] h-full ">
          <RiLoader2Line className="text-8xl animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-2xl text-center">No data available</p>
        </div>
      ) : (
        data.map((item, index) => (
          <FilterCard key={index} propertyData={item} id={String(item._id)} />
        ))
      )}
    </div>
      <nav className="flex justify-center mt-8">
        <ul className="pagination flex space-x-2">
          <li
            className={`page-item ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button
              className="px-3 py-1 bg-orange-500 text-white rounded-2xl"
              onClick={prePage}
            >
              Prev
            </button>
          </li>
          {getPaginationNumbers().map((n) => (
            <li
              key={n}
              className={`page-item ${
                currentPage === n ? "bg-orange-500 rounded-full text-white" : ""
              }`}
            >
              <button
                className="px-3 py-1 h-10 w-10 rounded-full"
                onClick={() => changeCpage(n)}
              >
                {n}
              </button>
            </li>
          ))}
          <li
            className={`page-item h-4 w-4 ${
              currentPage === npage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button
              className="px-3 py-1 bg-orange-500 text-white rounded-2xl"
              onClick={nextPage}
            >
              {" "}
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SectionGridFeaturePlaces;
