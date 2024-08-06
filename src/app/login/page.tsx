// "use client";
// import React, { FC, useState } from "react";
// import { Toaster, toast } from "sonner";
// import { CgSpinner } from "react-icons/cg";
// import axios from "axios";
// import Input from "@/shared/Input";
// import { useRouter } from "next/navigation";
// import ButtonPrimary from "@/shared/ButtonPrimary";
// import Link from "next/link";


// export interface PageLoginProps {}

// const PageLogin: FC<PageLoginProps> = ({}) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoggingIn, setIsLoggingIn] = useState(false);

//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoggingIn(true);
//     try {
//       const response = await axios.post("/api/user/login", {
//         email,
//         password,
//       });
//       if (response.status === 200) {
//         toast.success("Login successful");
//         router.push("/");
//       }
//     } catch (err) {
//       toast.error("Login failed. Please check your credentials.");
//       console.error("Login error", err);
//     } finally {
//       setIsLoggingIn(false);
//     }
//   };

//   return (
//     <>
//       <Toaster />
//       <div className={`nc-PageLogin`}>
//         <div className="container mb-24 lg:mb-32">
//           <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
//             Welcome Back
//           </h2>
//           <div className="max-w-md mx-auto space-y-6">
//             <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
//               <label className="block">
//                 <span className="text-neutral-800 dark:text-neutral-200">
//                   Email address
//                 </span>
//                 <Input
//                   type="email"
//                   placeholder="dummyemail@gmail.com"
//                   className="mt-1"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </label>
//               <label className="block">
//                 <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
//                   Password
//                   <Link href="/signup" className="font-semibold underline">
//                     Forgot Password
//                   </Link>
//                 </span>
//                 <Input
//                   type="password"
//                   placeholder="********"
//                   className="mt-1"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </label>
//               <ButtonPrimary type="submit" disabled={isLoggingIn}>
//                 {isLoggingIn ? (
//                   <div className="flex justify-center">
//                     logging in.. <CgSpinner className="animate-spin text-2xl" />
//                   </div>
//                 ) : (
//                   "Continue"
//                 )}
//               </ButtonPrimary>
//             </form>
//             <span className="block text-center text-neutral-700 dark:text-neutral-300">
//               New user?{" "}
//               <Link href="/signup" className="font-semibold underline">
//                 Create an account
//               </Link>
//             </span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PageLogin;


"use client";
import React, { FC, useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import Input from "@/shared/Input";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import Cookies from 'js-cookie';
import { parseCookies } from "nookies";

export interface PageLoginProps {}

const PageLogin: FC<PageLoginProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();


  const token = Cookies.get('token');

  useEffect(() => {
    const { token } = parseCookies();
    console.log("token", token);
    if (token) {
      router.push("/"); // Redirect to home or any other page
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });
      if (response.status === 200) {
        toast.success("Login successful");
        router.push("/");
      }
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className={`nc-PageLogin`}>
        <div className="container mb-24 lg:mb-32">
          <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
            Welcome Back
          </h2>
          <div className="max-w-md mx-auto space-y-6">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Email address
                </span>
                <Input
                  type="email"
                  placeholder="dummyemail@gmail.com"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Password
                  <Link href="/signup" className="font-semibold underline">
                    Forgot Password
                  </Link>
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
              <ButtonPrimary type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <div className="flex justify-center">
                    logging in.. <CgSpinner className="animate-spin text-2xl" />
                  </div>
                ) : (
                  "Continue"
                )}
              </ButtonPrimary>
            </form>
            <span className="block text-center text-neutral-700 dark:text-neutral-300">
              New user?{" "}
              <Link href="/signup" className="font-semibold underline">
                Create an account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLogin;
