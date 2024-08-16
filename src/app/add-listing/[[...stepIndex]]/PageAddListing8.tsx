"use client";
import { useEffect, useState } from "react";
import React, { FC } from "react";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";

export interface PageAddListing8Props {}

interface Page8State {
  currency: string;
  isPortion: Boolean;
  basePrice: number[];
  basePriceLongTerm: number[];
  weekendPrice: number[];
  weeklyDiscount: number[];
  monthlyDiscount: number[];
  longTermMonths: string[];
}

const PageAddListing8: FC<PageAddListing8Props> = () => {
  let portions = 0;
  const data = localStorage.getItem("page1") || "";
  if (data) {
    const value = JSON.parse(data)["numberOfPortions"];
    if (value) {
      portions = parseInt(value, 10);
    }
  }

  const [rentalType, setRentalType] = useState<string> (() => {
    const savedRentalType = localStorage.getItem("page1");
    if (!savedRentalType){
      return "Short Term";
    }
    const type = JSON.parse(savedRentalType)["rentalType"];
    return type || "Short Term";
  })

  const emptyStringArrayGenerator = (size: number) => {
    const emptyStringArray = Array.from({ length: size }, () => "");
    return emptyStringArray;
  };
  const emptyNumberArrayGenerator = (size: number) => {
    const emptyNumberArray = Array.from({ length: size }, () => 0);
    return emptyNumberArray;
  };

  const [myArray, setMyArray] = useState<number[]>(Array(portions).fill(1));
  const [isPortion, setIsPortion] = useState<Boolean>(() => {
    return portions > 1 ? true : false;
  });

  const [currency, setCurrency] = useState<string>("EURO");

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // const [longTermMonths, setLongTermMonths] = useState<string[]>([]);
  const [longTermMonths, setLongTermMonths] = useState<string[]>(() => {
    const savedLongTermMonths = localStorage.getItem("page8") || "";
    if (!savedLongTermMonths) {
      return emptyStringArrayGenerator(portions);
    }
    const value = JSON.parse(savedLongTermMonths)["longTermMonths"];
    return value || emptyStringArrayGenerator(portions);
  })

  const [basePrice, setBasePrice] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["basePrice"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [basePriceLongTerm, setBasePriceLongTerm] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["basePriceLongTerm"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [weekendPrice, setWeekendPrice] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8") || "";
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["weekendPrice"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [weeklyDiscount, setWeeklyDiscount] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8");
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["weeklyDiscount"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [monthlyDiscount, setMonthlyDiscount] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page8");
    if (!savedPage) {
      return emptyNumberArrayGenerator(portions);
    }
    const value = JSON.parse(savedPage)["monthlyDiscount"];
    return value || emptyNumberArrayGenerator(portions);
  });

  const [page8, setPage8] = useState<Page8State>(() => {
    const savedPage = localStorage.getItem("page8");
    return savedPage
      ? JSON.parse(savedPage)
      : {
          currency: "EURO",
          isPortion: false,
          basePrice: emptyNumberArrayGenerator(portions),
          basePriceLongTerm: emptyNumberArrayGenerator(portions),
          weekendPrice: emptyNumberArrayGenerator(portions),
          weeklyDiscount: emptyNumberArrayGenerator(portions),
          monthlyDiscount: emptyNumberArrayGenerator(portions),
          longTermMonths: emptyStringArrayGenerator(portions),
        };
  });

  useEffect(() => {
    const newPage = {
      currency: currency,
      isPortion: isPortion,
      basePrice: basePrice,
      basePriceLongTerm: basePriceLongTerm,
      weekendPrice: weekendPrice,
      weeklyDiscount: weeklyDiscount,
      monthlyDiscount: monthlyDiscount,
      longTermMonths: longTermMonths,
    };
    setPage8(newPage);
    localStorage.setItem("page8", JSON.stringify(newPage));
  }, [
    isPortion,
    basePrice,
    basePriceLongTerm,
    weekendPrice,
    weeklyDiscount,
    monthlyDiscount,
    currency,
    longTermMonths,
  ]);

  const handleSelectedMonths = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setLongTermMonths([...longTermMonths, e.target.value]);
    }else{
      console.log(e.target.value);
      const newLongTermArray = longTermMonths.filter((m) => m != e.target.value);
      setLongTermMonths(newLongTermArray);
    }
  };

  return (
    <div className=" flex flex-col gap-12">
      {rentalType && rentalType == "Both" && (
        <div className="">
          <h1 className="text-3xl font-semibold">
            Select Months for Long Term Pricing
          </h1>
          <div className=" flex flex-wrap gap-4 mt-4">
            {MONTHS.map((month, index) => {
              return (
                <div className="flex gap-2 items-center" key={index}>
                  <h1>{month}</h1>
                  <input
                    type="checkbox"
                    name="month"
                    value={month}
                    className="p-2 rounded-md cursor-pointer"
                    onChange={handleSelectedMonths}
                    defaultChecked={longTermMonths.includes(month)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {rentalType && (rentalType == "Short Term" || rentalType == "Both") && (
        <div>
          <h1 className="text-3xl font-semibold">Short Term Pricing</h1>
          <h2 className=" flex flex-wrap gap-2">( { MONTHS.filter((m, i) => !longTermMonths.includes(m)).map((month, index) => (
            <h2 key={index}>{month }, </h2>
          )) } )</h2>
          {myArray.map((item, index) => (
            <div key={index} className="mt-8">
              <div>
                <h2 className="text-2xl font-semibold">
                  Price for {isPortion ? `Portion ${index + 1}` : "Property"}
                </h2>
                <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  {` The host's revenue is directly dependent on the setting of rates and
                                              regulations on the number of guests, the number of nights, and the
                                              cancellation policy.`}
                </span>
              </div>
              <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
              {/* FORM */}
              <div className="space-y-8">
                {/* ITEM */}
                <FormItem label="Currency">
                  <Select>
                    <option value="EURRO">EURO</option>
                  </Select>
                </FormItem>
                <FormItem label="Monthly Price">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                    <Input
                      className="!pl-8 !pr-10"
                      placeholder="0.00"
                      value={basePriceLongTerm[index]}
                      onChange={(e) =>
                        setBasePriceLongTerm((prev) => {
                          const newBasePriceLongTermArray = [...prev];
                          newBasePriceLongTermArray[index] =
                            parseInt(e.target.value) || 0;
                          return newBasePriceLongTermArray;
                        })
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">EURO</span>
                    </div>
                  </div>
                </FormItem>
                {/* ----- */}
                {/* <FormItem label="Monthly Price">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">€</span>
                          </div>
                          <Input
                            className="!pl-8 !pr-10"
                            placeholder="0.00"
                            value={weekendPrice[index]}
                            onChange={(e) =>
                              setWeekendPrice((prev) => {
                                const newWeekendArray = [...prev];
                                newWeekendArray[index] =
                                  parseInt(e.target.value) || 0;
                                return newWeekendArray;
                              })
                            }
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">EURO</span>
                          </div>
                        </div>
                      </FormItem> */}
                {/* ----- */}
                <FormItem label="Monthly Discounts">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                    <Input
                      className="!pl-8 !pr-10"
                      placeholder="0.00"
                      value={monthlyDiscount[index]}
                      onChange={(e) =>
                        setMonthlyDiscount((prev) => {
                          const newMonthlyArray = [...prev];
                          newMonthlyArray[index] =
                            parseInt(e.target.value) || 0;
                          return newMonthlyArray;
                        })
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">every month</span>
                    </div>
                  </div>
                </FormItem>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className=" w-full border-b border-neutral-200 dark:border-neutral-700"></div>

      {rentalType && (rentalType == "Long Term" || rentalType == "Both") && (
        <div>
          <h1 className="text-3xl font-semibold">Long Term Pricing</h1>
          <h2 className=" flex gap-2">( { MONTHS.filter((m, i) => longTermMonths.includes(m)).map((month, index) => ( 
            <h2 key={index}>{month}, </h2>
          )) } )</h2>
          {myArray.map((item, index) => (
            <div key={index} className="mt-8">
              <div>
                <h2 className="text-2xl font-semibold">
                  Price for {isPortion ? `Portion ${index + 1}` : "Property"}
                </h2>
                <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  {` The host's revenue is directly dependent on the setting of rates and
                                        regulations on the number of guests, the number of nights, and the
                                        cancellation policy.`}
                </span>
              </div>
              <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
              {/* FORM */}
              <div className="space-y-8">
                {/* ITEM */}
                <FormItem label="Currency">
                  <Select>
                    <option value="EURRO">EURO</option>
                  </Select>
                </FormItem>
                <FormItem label="Monthly Price">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                    <Input
                      className="!pl-8 !pr-10"
                      placeholder="0.00"
                      value={basePriceLongTerm[index]}
                      onChange={(e) =>
                        setBasePriceLongTerm((prev) => {
                          const newBasePriceLongTermArray = [...prev];
                          newBasePriceLongTermArray[index] =
                            parseInt(e.target.value) || 0;
                          return newBasePriceLongTermArray;
                        })
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">EURO</span>
                    </div>
                  </div>
                </FormItem>
                {/* ----- */}
                {/* <FormItem label="Monthly Price">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                    <Input
                      className="!pl-8 !pr-10"
                      placeholder="0.00"
                      value={weekendPrice[index]}
                      onChange={(e) =>
                        setWeekendPrice((prev) => {
                          const newWeekendArray = [...prev];
                          newWeekendArray[index] =
                            parseInt(e.target.value) || 0;
                          return newWeekendArray;
                        })
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">EURO</span>
                    </div>
                  </div>
                </FormItem> */}
                {/* ----- */}
                <FormItem label="Monthly Discounts">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                    <Input
                      className="!pl-8 !pr-10"
                      placeholder="0.00"
                      value={monthlyDiscount[index]}
                      onChange={(e) =>
                        setMonthlyDiscount((prev) => {
                          const newMonthlyArray = [...prev];
                          newMonthlyArray[index] =
                            parseInt(e.target.value) || 0;
                          return newMonthlyArray;
                        })
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">every month</span>
                    </div>
                  </div>
                </FormItem>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageAddListing8;
