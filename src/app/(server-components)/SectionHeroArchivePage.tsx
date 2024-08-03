"use client";
import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import imagePng from "@/images/hero-right2.png";
import HeroSearchForm, {
  SearchTab,
} from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image, { StaticImageData } from "next/image";
import { useSearchParams } from "next/navigation";
import { MyContext } from "@/context/propertyContext";
import { PropertyDataType } from "@/data/types";

export interface SectionHeroArchivePageProps {
  className?: string;
  listingType?: ReactNode;
  // currentPage: "Stays" | "Experiences" | "Cars" | "Flights";
  currentPage: "Short Term Rentals" | "Long Term Rentals";
  currentTab: SearchTab;
  rightImage?: StaticImageData;
}

const SectionHeroArchivePage: FC<SectionHeroArchivePageProps> = ({
  className = "",
  listingType,
  currentPage,
  currentTab,
  rightImage = imagePng,
}) => {

  const searchParams = useSearchParams();
  const country: string = searchParams.get("place") || "Greece";
  // const [allPropertiesTemp, setAllPropertiesTemp] = useState<PropertyDataType | undefined> (undefined);
  const [countryPropertyCount, setCountryPropertyCount] = useState(0);
  const [countryContext, setCountryContext] = useState<PropertyDataType | undefined>(undefined);
  const [placeCount, setPlaceCount] = useState<number> (0);
  const guests: number = searchParams.get("guests") ? Number(searchParams.get("guests")) : 2;
  
  const context = useContext(MyContext);


  useEffect(() => {
    let countryCount = 0;
    let placeCount = 0;
    const contextArray = Array.isArray(context) ? context : [context];
    contextArray.forEach((property) => {
      if (property?.country === country && property?.guests[0] >= guests) {
        placeCount++;
      }
      if (property?.city === country && property?.guests[0] >= guests) {
        placeCount++;
      }
    });
    setCountryPropertyCount(countryCount);
    setPlaceCount(placeCount);
  }, [countryContext, context, country])

  return (
    <div
      className={`nc-SectionHeroArchivePage flex flex-col relative ${className}`}
      data-nc-id="SectionHeroArchivePage"
    >
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-6 lg:space-y-10 pb-14 lg:pb-64 xl:pb-80 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl leading-[110%]">
            {country}
          </h2>
          <div className="flex items-center text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            <i className="text-2xl las la-map-marked"></i>
            <span className="ml-2.5">{country} </span>
            <span className="mx-5"></span>
            {listingType ? (
              listingType
            ) : (
              <>
                <i className="text-2xl las la-home"></i>
                {/* <span className="ml-2.5">{greecePropertyCount} Properties</span> */}
                <span className="ml-2.5">{placeCount} Properties</span>
              </>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <Image
            className="w-full"
            src={rightImage}
            alt="hero"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          />
        </div>
      </div>

      <div className="hidden lg:flow-root w-full">
        {/* <div className="z-10 lg:-mt-40 xl:-mt-56 w-full">
          <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
        </div> */}
      </div>
    </div>
  );
};

export default SectionHeroArchivePage;
