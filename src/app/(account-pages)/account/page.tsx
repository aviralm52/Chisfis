"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/Label";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import axios from "axios";
import { Toaster, toast } from "sonner";

const AccountPage = () => {
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [language, setLanguage] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [bankdetails, setBankDetails] = useState("");
  // const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (user) {
      setName(user?.name || "");
      setGender(user?.gender || "");
      setLanguage(user?.spokenLanguage || " ");
      setNationality(user?.nationality);
      setEmail(user?.email || "");
      setAddress(user?.address || "");
      setPhone(user.phone || "");
      setBankDetails(user.bankDetails || "");
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const updateData = {
        _id: user?._id,
        name,
        gender,
        spokenLanguage: language,
        address,
        phone,
        nationality,
        bankdetails,
      };
      const response = await axios.put("/api/user/editprofile", updateData);
      if (response.data.success) {
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="space-y-6 sm:space-y-8">
        <h2 className="text-3xl font-semibold">Account information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 flex items-start">
            <div className="relative rounded-full overflow-hidden flex">
              <Avatar sizeClass="w-32 h-32" />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                <span className="mt-1 text-xs">Change Image</span>
              </div>
              {/* <Input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setProfilePic(e.target.files[0])} 
            /> */}
            </div>
          </div>
          <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
            <div className="relative mt-1.5">
              <Label>Name</Label>
              <div className="">
                <Input
                  className="w-full"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <Label>Gender</Label>
              <Select
                className="mt-1.5"
                value={gender}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setGender(e.target.value)
                }>
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div>
              <Label>Language</Label>
              <Input
                className="mt-1.5"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
            <div>
              <Label>Nationality</Label>
              <Input
                className="mt-1.5"
                value={nationality || ""}
                onChange={(e) => setNationality(e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1.5"
                value={email}
                disabled // Disable email editing
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                className="mt-1.5"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <Label>Phone number</Label>
              <Input
                className="mt-1.5"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label>Bank Details</Label>
              <Input
                className="mt-1.5"
                value={bankdetails}
                onChange={(e) => setBankDetails(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <ButtonPrimary onClick={handleSubmit}>Update info</ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
