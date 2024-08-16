"use client";

import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import NcInputNumber from "@/components/NcInputNumber";
import React, { FC, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";
import { NextPage } from "next";
// import CustomDayPicker from "@/components/CustomDayPicker";
import { DayPicker } from "react-day-picker";

export interface PageAddListing9Props {}

interface Page9State {
  night: number[];
	month: number[];
  time: number[];
  datesPerPortion: number[][];
}

const CustomDayPicker = dynamic(() => import("@/components/CustomDayPicker"), {
  ssr: false,
});

const PageAddListing9: FC<PageAddListing9Props> = () => {
  let portions = 0;
  const data = localStorage.getItem("page1") || "";
  if (data) {
    const value = JSON.parse(data)["numberOfPortions"];
    if (value) {
      portions = parseInt(value, 10);
    }
  }

  const [myArray, setMyArray] = useState<number[]>(Array(portions).fill(1));

  const [datesPerPortion, setDatesPerPortion] = useState<number[][]>(() => {
    const savedPage = localStorage.getItem("page9");
    if (!savedPage) {
      return Array.from({ length: portions }, () => []);
    }
    const value = JSON.parse(savedPage)["datesPerPortion"];
    return value || Array.from({ length: portions }, () => []);
  });

  const [night, setNight] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page9") || "";
    if (!savedPage) {
      return [3, 21];
    }
    const value = JSON.parse(savedPage)["night"];
    return value || [3, 21];
  });

	const [month, setMonth] = useState<number[]>(() => {
		const savedPage = localStorage.getItem("page9") || "";
		if (!savedPage){
			return [1,12];
		}
		const value = JSON.parse(savedPage)["month"];
		return value || [1,12];
	})

  const [time, setTime] = useState<number[]>(() => {
    const savedPage = localStorage.getItem("page9") || "";
    if (!savedPage) {
      return [10, 12];
    }
    const value = JSON.parse(savedPage)["time"];
    return value || [10, 12];
  });

  const [page9, setPage9] = useState<Page9State>({
    night: night,
		month: month,
    time: time,
    datesPerPortion: datesPerPortion,
  });

  useEffect(() => {
    const newPage9: Page9State = {
      night: night,
			month: month,
      time: time,
      datesPerPortion: datesPerPortion,
    };
    setPage9(newPage9);
    localStorage.setItem("page9", JSON.stringify(newPage9));
  }, [night, month, time, datesPerPortion]);

  const handleDateChange = (dates: number[], portionIndex: number) => {
    setDatesPerPortion((prevDates) => {
      const updatedDates = [...prevDates];
      updatedDates[portionIndex] = dates;
      return updatedDates;
    });
  };

  const getAllSelectedDates = () => {
    return datesPerPortion.flat();
  };

  const [rentalType, setRentalType] = useState<string>(() => {
    const savedPage = localStorage.getItem("page1") || "";
    if (!savedPage) {
      return "Short Term";
    }
    const type = JSON.parse(savedPage)["rentalType"];
    return type || "Short Term";
  });

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">How long can guests stay?</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          {` Shorter trips can mean more reservations, but you'll turn over your
            space more often.`}
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}


      {rentalType && (rentalType == "Short Term" || rentalType == "Both") && (
        <div className="space-y-7">
          {/* ITEM */}
          <NcInputNumber
            label="Nights min"
            defaultValue={night[0]}
            onChange={(value) => setNight([value, night[1]])}
						min={1}
						max={30}
          />
          <NcInputNumber
            label="Nights max"
            defaultValue={night[1]}
            onChange={(value) => setNight([night[0], value])}
						min={1}
						max={30}
          />
        </div>
      )}


      {rentalType && (rentalType == "Long Term" || rentalType == "Both") && (
        <div className="space-y-7">
          {/* ITEM */}
          <NcInputNumber
            label="Months min"
            defaultValue={month[0]}
            onChange={(value) => setMonth([value, month[1]])}
						min={1}
						max={12}
          />
          <NcInputNumber
            label="Months max"
            defaultValue={month[1]}
            onChange={(value) => setMonth([month[0], value])}
						min={1}
						max={12}
          />
        </div>
      )}


      <div>
        <div className="flex justify-between rounded-md items-center">
          <label htmlFor="">Check-in Time</label>
          <input
            type="number"
            className=" bg-transparent rounded-2xl w-32 text-center"
            value={time[0]}
            onChange={(e) => setTime([parseInt(e.target.value), time[1]])}
          />
        </div>
        <div className="flex justify-between rounded-md items-center mt-2">
          <label htmlFor="">Check-out Time</label>
          <input
            type="number"
            className=" bg-transparent rounded-2xl w-32 text-center"
            value={time[1]}
            onChange={(e) => setTime([time[0], parseInt(e.target.value)])}
          />
        </div>
      </div>

      {/*  */}
      <div>
        <h2 className="text-2xl font-semibold">Set your availability</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Editing your calendar is easy—just select a date to block or unblock
          it. You can always make changes after you publish.
        </span>
      </div>

      {myArray.map((dates, index) => (
        <div className="border border-white rounded-xl p-2" key={index}>
          <span className="text-2xl ml-4 font-medium">Portion {index + 1}</span>
          <div className="addListingDatePickerExclude mt-2" key={index}>
            {/* <DatePicker
                            onChange={(date) => handleDateChange(date, index)}
                            // selected={startDate}
                            monthsShown={2}
                            showPopperArrow={false}
                            // excludeDates={getAllSelectedDates().map((item) => new Date(item))}
                            excludeDates={datesPerPortion[index]?.map(
                                (item) => new Date(item)
                            )}
                            inline
                            renderCustomHeader={(p) => (
                                <DatePickerCustomHeaderTwoMonth {...p} />
                            )}
                            renderDayContents={(day, date) => (
                                <DatePickerCustomDay
                                    dayOfMonth={day}
                                    date={date}
                                />
                            )}
                        /> */}
            <CustomDayPicker
              key={index}
              index={index}
              datesPerPortion={datesPerPortion}
              setDatesPerPortion={setDatesPerPortion}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default PageAddListing9;
