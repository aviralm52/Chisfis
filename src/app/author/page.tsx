"use client";
import { Tab } from "@headlessui/react";
import { MdCastForEducation } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { format } from "date-fns";
import { BsPencilSquare } from "react-icons/bs";


import StartRating from "@/components/StartRating";
import { useAuth } from "@/hooks/useAuth";
import { Properties } from "../page";
import React, { FC, Fragment, useEffect, useState } from "react";
import axios from "axios";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";

export interface AuthorPageProps {}

const AuthorPage: FC<AuthorPageProps> = ({}) => {
  let [categories] = useState(["Short Term", "Long Term"]);
  const { user } = useAuth();
  const imgUrl =
    "https://i.pinimg.com/736x/70/78/6e/70786e80f3eb04dc3f42f6504797be3c.jpg";

  const [properties, setProperties] = useState<Properties[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRentalType, setSelectedRentalType] =
    useState<string>("Short Term");

  useEffect(() => {
    console.log("user._id: ", user?._id);
    const fetchProperties = async () => {
      if (user?._id) {
        setLoading(true);
        try {
          const response = await axios.post("/api/user/fetchpropertybyuserid", {
            userId: user._id,
          });
          setProperties(response.data.properties);
        } catch (error) {
          console.error("Error fetching properties:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProperties();
  }, [user?._id]);

  // console.log(properties.length);
  console.log(properties);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Just Created";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return format(date, "yyyy");
  };

  const filteredProperties = properties.filter(
    (property) => property?.rentalType === selectedRentalType
  );

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
          <Tab.Group
            onChange={(index) => setSelectedRentalType(categories[index])}
          >
            <Tab.List className="flex space-x-1 overflow-x-auto">
              {categories.map((item, index) => (
                <Tab key={index} as={Fragment}>
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
              {/* First Tab Panel: Short Term */}
              <Tab.Panel className="">
                <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
                  {loading
                    ? [0, 1, 2, 3].map((n) => (
                        <>
                          <div className="flex flex-col gap-y-2">
                            <div
                              key={n}
                              className="w-full h-64 bg-primary-50 rounded-lg animate-pulse"
                            ></div>
                            <div className="w-56 rounded-lg h-3 bg-slate-300 animate-pulse mt-2"></div>
                            <div className="w-40 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
                            <div className="flex items-center justify-between">
                              <div className="w-32 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
                              <div className="w-10 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
                            </div>
                          </div>
                        </>
                      ))
                    : filteredProperties.map((item) => (
                        <>
                          <Link
                            className="    text-primary-6000 "
                            href={{
                              pathname: "/editproperty",
                              query: { id: item._id },
                            }}
                          >
                            <PropertyCard key={item._id} data={item} />
                            <BsPencilSquare className="  text-primary-6000 mt-2 text-xl rounded-lg" />
                          </Link>
                        </>
                      ))}
                </div>
              </Tab.Panel>
              <Tab.Panel className="">
                <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
                  {loading
                    ? [0, 1, 2, 3].map((n) => (
                        <>
                          <div className="flex flex-col gap-y-2">
                            <div
                              key={n}
                              className="w-full h-64 bg-primary-50 rounded-lg animate-pulse"
                            ></div>
                            <div className="w-56 rounded-lg h-3 bg-slate-300 animate-pulse mt-2"></div>
                            <div className="w-40 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
                            <div className="flex items-center justify-between">
                              <div className="w-32 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
                              <div className="w-10 rounded-lg h-3 bg-slate-300 animate-pulse mt-1"></div>
                            </div>
                          </div>
                        </>
                      ))
                    : filteredProperties.map((item) => (
                        <>
                          <Link
                            className="    text-primary-6000 "
                            href={{
                              pathname: "/editproperty",
                              query: { id: item._id },
                            }}
                          >
                            <PropertyCard key={item._id} data={item} />
                            <BsPencilSquare className="  text-primary-6000 mt-2 text-xl rounded-lg" />
                          </Link>
                        </>
                      ))}
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
        </div>
      </main>
    </div>
  );
};

export default AuthorPage;
