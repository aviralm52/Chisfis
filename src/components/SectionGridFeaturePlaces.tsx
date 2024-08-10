"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { DEMO_STAY_LISTINGS } from "@/data/listings";
import { StayDataType } from "@/data/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import HeaderFilter from "./HeaderFilter";
import StayCard from "./StayCard";
import StayCard2 from "./StayCard2";
import CustomStayCard from "./CustomStayCard";
import Link from "next/link";
import { Properties } from "@/app/page";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import { PropertyDataType } from "@/data/types";

// OTHER DEMO WILL PASS PROPS
const DEMO_DATA: StayDataType[] = DEMO_STAY_LISTINGS.filter((_, i) => i < 8);

//
export interface SectionGridFeaturePlacesProps {
  stayListings?: StayDataType[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  cardType?: "card1" | "card2";
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  stayListings = DEMO_DATA,
  gridClass = "",
  heading = "Featured places to stay",
  subHeading = "Popular places to stay that Chisfis recommends for you",
  headingIsCenter,
  tabs = ["Greece", "Italy", "Romania", "Spain"],
  cardType = "card2",
}) => {
  const renderCard = (stay: PropertyDataType, index: number) => {
    let CardName = PropertyCard;
    switch (cardType) {
      case "card1":
        CardName = PropertyCard;
        break;
      case "card2":
        CardName = PropertyCard;
        break;

      default:
        CardName = PropertyCard;
    }

    return <CardName key={stay.id} data={stay} index={index} />;
  };

  const [allProperties, setAllProperties] = useState<Properties[]>()

  useEffect(() => {
    const getAllProperties = async () => {
      const response = await axios.get("/api/allproperties", {
        params: {
          limit: 8
        }
      });
      if (response.data){
        setAllProperties(response.data);
      }
    }

    getAllProperties();
  }, [])


  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={"New York"}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
      />
      <div
        className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {/* {stayListings.map((stay, index) => renderCard(stay, index))} */}
        {allProperties?.map((stay, index) => renderCard(stay, index))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <Link href="/allproperties">
          <ButtonPrimary>Show me more</ButtonPrimary>
        </Link>
      </div>
    </div>
  );
};

export default SectionGridFeaturePlaces;
