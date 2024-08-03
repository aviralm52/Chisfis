"use client";
import React from "react";
import CheckOutPagePageMain from "./PageMain";
import ProtectedRoute from "@/components/ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <CheckOutPagePageMain />;
    </ProtectedRoute>
  );
};

export default page;
