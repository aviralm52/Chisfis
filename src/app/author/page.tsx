"use client";
import { Tab } from "@headlessui/react";
import { MdCastForEducation } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { format } from "date-fns";
import CarCard from "@/components/CarCard";
import ExperiencesCard from "@/components/ExperiencesCard";
import StartRating from "@/components/StartRating";
import StayCard from "@/components/StayCard2";
import { useAuth } from "@/hooks/useAuth";
import {
  DEMO_CAR_LISTINGS,
  DEMO_EXPERIENCES_LISTINGS,
  DEMO_STAY_LISTINGS,
} from "@/data/listings";
import React, { FC, Fragment, useEffect, useState } from "react";
import ButtonSecondary from "@/shared/ButtonSecondary";
import axios from "axios";
import { PencilIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";

export interface AuthorPageProps {}

const AuthorPage: FC<AuthorPageProps> = ({}) => {
  let [categories] = useState(["Stays", "Experiences", "Car for rent"]);
  const { user } = useAuth();
  const imgUrl =
    "https://i.pinimg.com/736x/70/78/6e/70786e80f3eb04dc3f42f6504797be3c.jpg";

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (user?._id) {
        setLoading(true);
        try {
          const response = await axios.post("/api/user/fetchpropertybyuserid", {
            userId: user._id,
          });
          console.log("response", response.data);
          setProperties(response.data);
        } catch (error) {
          console.error("Error fetching properties:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProperties();
  }, [user?._id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Just Created";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return format(date, "yyyy");
  };
  const renderSidebar = () => {
    return (
      <>
        <div className=" w-full flex flex-col items-center text-center sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8">
          {loading ? (
            <div className="w-28 h-28 rounded-full animate-pulse bg-primary-50 object-cover"></div>
          ) : (
            <img
              src={user?.profilePic || imgUrl}
              alt="profilePic"
              className="w-28 h-28 rounded-full object-cover"
            />
          )}
          <div className="space-y-3 text-center flex flex-col items-center">
            <h2 className="text-3xl font-semibold">
              <span className="text-neutral-6000 dark:text-neutral-300">
                {loading ? (
                  <div className="w-56 h-10 bg-primary-50 rounded-lg animate-pulse"></div>
                ) : (
                  <div>{user?.name || "Notfound"}</div>
                )}
              </span>
            </h2>
            <StartRating className="!text-base" />
          </div>
          <div className="border-b border-neutral-200 dark:border-neutral-700 w-14"></div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <IoHomeOutline className="text-neutral-400 text-xl" />
              <span className="text-neutral-6000 dark:text-neutral-300">
                {loading ? (
                  <div className="w-56 h-5 bg-primary-50 rounded-lg animate-pulse"></div>
                ) : (
                  <div>{user?.address || "Notfound"}</div>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <MdCastForEducation className="text-neutral-400 text-xl" />
              <span className="text-neutral-6000 dark:text-neutral-300">
                {loading ? (
                  <div className="w-56 h-5 bg-primary-50 rounded-lg animate-pulse"></div>
                ) : (
                  <div>{user?.spokenLanguage || "Notfound"}</div>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <FaRegCalendarAlt className="text-neutral-400 text-xl" />
              <span className="text-neutral-6000 dark:text-neutral-300">
                {loading ? (
                  <div className="w-56 h-5 bg-primary-50 rounded-lg animate-pulse"></div>
                ) : (
                  <div>
                    Joind at {formatDate(user?.createdAt) || "Not Found"}
                  </div>
                )}
              </span>
            </div>
          </div>
          <Link href="/account">
            <ButtonPrimary>
              <div className="flex items-center gap-x-1">
                Edit <HiPencilSquare />
              </div>
            </ButtonPrimary>
          </Link>
        </div>
      </>
    );
  };

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {loading ? (
              <div className="w-80 h-7 bg-primary-50 rounded-lg animate-pulse"></div>
            ) : (
              <h2 className="text-2xl font-semibold">
                {`${user?.name} Properties ` || "Not Found"}
              </h2>
            )}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div>
          <Tab.Group>
            <Tab.List className="flex space-x-1 overflow-x-auto">
              {categories.map((item) => (
                <Tab key={item} as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${
                        selected
                          ? "bg-secondary-900 text-secondary-50 "
                          : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      } `}
                    >
                      {item}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="">
                <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
                  {DEMO_STAY_LISTINGS.filter((_, i) => i < 4).map((stay) => (
                    <StayCard key={stay.id} data={stay} />
                  ))}
                </div>
                <div className="flex mt-11 justify-center items-center">
                  <ButtonSecondary>Show me more</ButtonSecondary>
                </div>
              </Tab.Panel>
              <Tab.Panel className="">
                <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
                  {DEMO_EXPERIENCES_LISTINGS.filter((_, i) => i < 4).map(
                    (stay) => (
                      <ExperiencesCard key={stay.id} data={stay} />
                    )
                  )}
                </div>
                <div className="flex mt-11 justify-center items-center">
                  <ButtonSecondary>Show me more</ButtonSecondary>
                </div>
              </Tab.Panel>
              <Tab.Panel className="">
                <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
                  {DEMO_CAR_LISTINGS.filter((_, i) => i < 4).map((stay) => (
                    <CarCard key={stay.id} data={stay} />
                  ))}
                </div>
                <div className="flex mt-11 justify-center items-center">
                  <ButtonSecondary>Show me more</ButtonSecondary>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-AuthorPage `}>
      <main className="container mt-12 mb-24 lg:mb-32 flex flex-col lg:flex-row">
        <div className="block flex-grow mb-24 lg:mb-0">
          <div className="lg:sticky lg:top-24">{renderSidebar()}</div>
        </div>
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
          {renderSection1()}
          {/* {renderSection2()} */}
        </div>
      </main>
    </div>
  );
};

export default AuthorPage;
