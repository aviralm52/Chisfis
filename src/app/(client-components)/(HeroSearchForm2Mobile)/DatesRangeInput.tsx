"use client";

import DatePicker from "react-datepicker";
import React, { FC, Fragment, useEffect, useState } from "react";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";

export interface StayDatesRangeInputProps {
  className?: string;
  prices?: number[][];
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "",
  prices,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2024/10/10")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2024/10/23"));

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const getPriceForDate = (date: Date) => {
    const month = date.getMonth(); // 0 = January, 11 = December
    const day = date.getDate() - 1; // Day starts from 1, array index starts from 0

    return prices?.[month]?.[day] || null; // Return the price if available, otherwise null
  };

  return (
    <div>
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          {` When's your trip?`}
        </span>
      </div>
      <div
        className={`relative flex-shrink-0 flex justify-center z-10 py-5 ${className} `}
      >
        <DatePicker
          selected={startDate}
          onChange={onChangeDate}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          monthsShown={2}
          showPopperArrow={false}
          inline
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          // renderDayContents={(day, date) => (
          //   <DatePickerCustomDay dayOfMonth={day} date={date} />
          // )}
          renderDayContents={(day, date) => {
            const price = getPriceForDate(date || new Date());
            return (
              <div>
                <DatePickerCustomDay dayOfMonth={day} date={date} />
                {price && (
                  <div style={{ fontSize: "0.8rem", color: "green" }}>
                    ${price}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
