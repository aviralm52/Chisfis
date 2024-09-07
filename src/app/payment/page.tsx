"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { LuLoader2 } from "react-icons/lu";
import { toast, Toaster } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function Payment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [amount, setAmount] = useState("0");
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const amount = parseInt(params.get("amount") || "299");
  const paymentToken = params.get("paymentToken");

  const decryptToken = async () => {
    try {
      console.log(paymentToken);
      const response = await axios.post("api/decrypt", {
        amount: amount,
        encryptedAmount: paymentToken,
      });
      console.log(response.data);
      toast.success(response.data.message);
      return true;
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Invalid Payment Token");
      return false;
    }
  };

  const createOrderId = async () => {
    try {
      const response = await axios.post("/api/order", {
        amount: amount * 100,
        currency: currency,
      });
      console.log("orderId response: ",response);
      console.log(response.data.orderId);
      return response.data.orderId;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    if (!amount) {
      // router.replace("/");
      alert("Invalid Amount");
      return;
    }
    const result = await decryptToken();
    if (!result) return;

    try {
      const orderId = await createOrderId();
      console.log(orderId);
      const options = {
        key: process.env.RAZORPAY_API_KEY,
        amount: amount * 100,
        currency: currency,
        name: "VacationSaga",
        description: "Listing Plan Subscription",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          console.log("option data: ", data);

          try {
            console.log("here");
            const result = await axios.post("/api/verify", { data: data });
            console.log(result);
            alert("Payment Successful");
          } catch (err) {
            console.log("error in payment: ", err);
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#F7951D",
        },
      };
      const paymentObject = new window.Razorpay(options);
      console.log(paymentObject);
      paymentObject.on("payment.failed", function (response: any) {
        console.log(response.error);
        console.log(response.error.description);
        alert(response.error.description);
      });
      setLoading(false);
      paymentObject.open();
      router.push("/add-listing/10");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Toaster/>
      <section className=" min-h-[94vh] flex flex-col gap-6 h-14 mx-5 sm:mx-10 2xl:mx-auto 2xl:w-[1400px] items-center pt-36 ">
        <h1 className=" text-4xl font-bold ">Checkout</h1>
        <form
          className="flex flex-col gap-6 w-full sm:w-80 border border-neutral-600 px-4 py-8 rounded-xl"
          onSubmit={processPayment}
        >
          <div className=" flex flex-col gap-8 mt-8 borer-2 dark:border-white">
            <h2 className=" font-semibold text-xl">Continue</h2>
            <p className=" font-light">
              By Clicking on pay you will purchase the plan of €{amount}
            </p>

            <button
              type="submit"
              className=" bg-primary-6000 hover:bg-primary-700 w-full rounded-xl p-2 font-semibold"
            >
              {loading ? (
                <LuLoader2 className=" animate-spin mx-auto text-2xl font-bold" />
              ) : (
                "Pay"
              )}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Payment;
