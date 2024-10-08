"use client";

import React, { FC, useState } from "react";

export interface CheckboxProps {
  label?: string;
  subLabel?: string;
  className?: string;
  name: string;
  defaultChecked?: boolean;
  setPropertyType: (value: string) => void;
  onChange?: (checked: boolean) => void;
}


const Checkbox: FC<CheckboxProps> = ({
  setPropertyType,
  subLabel = "",
  label = "",
  name,
  className = "",
  defaultChecked,
  onChange,
}) => {
  return (
    <div className={`flex text-sm sm:text-base ${className}`}>
      <input
        id={name}
        name={name}
        type="radio"
        className="focus:ring-action-primary h-6 w-6 text-primary-500 border-primary rounded border-neutral-500 bg-white dark:bg-neutral-700  dark:checked:bg-primary-500 focus:ring-primary-500"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange && onChange(e.target.checked)}
        onClick={(e) => {
          const inputElement = e.target as HTMLInputElement;
          // setPropertyType(inputElement.label)
          setPropertyType(label)
          console.log(label);
        }}
      />
      {label && (
        <label
          htmlFor={name}
          className="ml-3.5 flex flex-col flex-1 justify-center">
          <span className=" text-neutral-900 dark:text-neutral-100">
            {label}
          </span>
          {subLabel && (
            <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm font-light">
              {subLabel}
            </p>
          )}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
