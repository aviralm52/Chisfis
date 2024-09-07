import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const generatedSignature = (razorpayOrderId, razorpayPaymentId) => {
  const keySecret = process.env.RAZORPAY_APT_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(request) {
  const data = await request.json();
  console.log("verify data: ", data);
  const { orderCreationId, razorpayPaymentId, razorpaySignature } = {
    ...data.data,
  };

  console.log(orderCreationId, razorpayPaymentId, razorpaySignature);

  const signature = generatedSignature(orderCreationId, razorpayPaymentId);
  console.log("signature: ", signature);
  if (signature !== razorpaySignature) {
    console.log("invalid signature");
    return NextResponse.json(
      { message: "payment verification failed", isOk: false },
      { status: 400 }
    );
  }
  console.log("valid signature");
  return NextResponse.json(
    { message: "payment verified successfully", isOk: true },
    { status: 200 }
  );
}
