"use client";

import React, { FC,  useState, useEffect } from "react";
import axios from "axios";
import { StayDataType } from "@/data/types";
import { useSearchParams } from "next/navigation";
import TabFilters from "../(stay-listings)/TabFiltersTwo";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";
import PropertyCard from "@/components/PropertyCard";
import { Properties } from "../page";

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
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(999999999);

  const fetchProperties = async () => {
    console.log("use effect called");
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/countryspecificproperties/${country}`,
        {
          params: {
            limit: 28,
          },
        }
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
      country,
    });
    if (response.data) {
      setData(response.data);
      setLoading(false);
      console.log(response.data);
    } else {
      console.log("no data");
      setLoading(false);
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
          <ButtonThird onClick={fetchProperties}>Clear</ButtonThird>
        </div>
      </div>

      <div
        className={`grid mt-8 mb-3  gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="flex flex-col gap-y-2">
              <div className="w-full h-64 bg-primary-50 rounded-lg animate-pulse"></div>
              <div className="w-56 rounded-lg h-3 bg-slate-300 animate-pulse mt-2"></div>
              <div className="w-40 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
              <div className="flex items-center justify-between">
                <div className="w-32 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
                <div className="w-10 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
              </div>
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-2xl text-center">No data available</p>
          </div>
        ) : (
          data.map((item, index) => <PropertyCard key={index} data={item} />)
        )}
      </div>
    </div>
  );
};

export default SectionGridFeaturePlaces;
