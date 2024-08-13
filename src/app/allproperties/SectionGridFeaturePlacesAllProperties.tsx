"use client";
import React, { FC, ReactNode, useState, useEffect } from "react";
import axios from "axios";
import { PropertyDataType, StayDataType } from "@/data/types";
import HeaderFilter from "@/components/HeaderFilter";
import PropertyCard from "@/components/PropertyCard";
import { useInView } from "react-intersection-observer";

export interface SectionGridFeaturePlacesProps {
  stayListings?: StayDataType[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
  cardType?: "card1" | "card2";
}

const SectionGridFeaturePlacesAllProperties: FC<SectionGridFeaturePlacesProps> = ({
  stayListings,
  gridClass = "",
  heading = "Places to stay",
  subHeading = "Popular places to stay that Chisfis recommends for you",
  headingIsCenter,
  tabs = ["Greece", "Italy", "Romania", "Spain"],
  cardType = "card2",
}) => {
  const [fetchedData, setFetchedData] = useState<PropertyDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (initialLoad) {
      window.scrollTo(0, 0);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/allproperties?limit=12&page=${page}`);
        setFetchedData((prevData) => [...prevData, ...response.data]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page]);

  useEffect(() => {
    if (inView && !loading && !initialLoad) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading, initialLoad]);

  const renderCard = (stay: PropertyDataType, index: number) => {
    return <PropertyCard key={stay._id} data={stay} index={index} />;
  };

  return (
    <div className="nc-SectionGridFeaturePlaces p-4 relative">
      <HeaderFilter
        tabActive={"New York"}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
      />
      <div
        className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {loading && fetchedData.length === 0
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
          : fetchedData.map((stay, index) => renderCard(stay, index))}
      </div>
      <div
        ref={ref}
        className={`grid gap-6 md:gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
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
        ) : (
          <p>Scroll to load more properties...</p>
        )}
      </div>
    </div>
  );
};

export default SectionGridFeaturePlacesAllProperties;
