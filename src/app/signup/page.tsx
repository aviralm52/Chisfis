"use client";
import React, { FC, useState, FormEvent } from "react";
import { CgSpinner } from "react-icons/cg";

import Input from "@/shared/Input";
import { Toaster, toast } from "sonner";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import axios from "axios";

export interface PageSignUpProps {}

const PageSignUp: FC<PageSignUpProps> = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = () => {
    if (!name) {
      toast.error("Please enter your name");
      return false;
    }
    if (!gmailRegex.test(email)) {
      toast.error("Please enter a valid Gmail address");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const onSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/user/signup", {
        name,
        email,
        password,
      });
      console.log("Signup successful:", response.data);
      toast.success(
        "Signup successful! Please verify your email address via link that has been sent to your email address."
      );
      // Redirection: Redirect to login page
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="nc-PageSignUp">
        <div className="container mb-24 lg:mb-32">
          <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
            Signup
          </h2>
          <div className="max-w-md mx-auto space-y-6">
            <form className="grid grid-cols-1 gap-6" onSubmit={onSignup}>
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Name
                </span>
                <Input
                  type="text"
                  placeholder="Your name"
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Gmail address
                </span>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Password
                </span>
                <Input
                  type="password"
                  placeholder="********"
                  className="mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Confirm Password
                </span>
                <Input
                  type="password"
                  placeholder="********"
                  className="mt-1"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
              <ButtonPrimary type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    Signing up...
                    <CgSpinner className="animate-spin" />
                  </div>
                ) : (
                  "Sign up"
                )}
              </ButtonPrimary>
            </form>
            <span className="block text-center text-neutral-700 dark:text-neutral-300">
              Already have an account? {` `}
              <Link href="/login" className="font-semibold underline">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageSignUp;
