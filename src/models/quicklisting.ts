// import { QuicklistingSchema } from "@/schemas/quicklisting.schema";
import mongoose, { Schema } from "mongoose";
import { customAlphabet } from "nanoid";

const generateQID = (length: number): string => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generateUniqueId = customAlphabet(charset, length);
  return generateUniqueId();
};

const QuicklistingSchema: Schema = new Schema(
  {
    QID: { type: String, default: () => generateQID(5) },
    ownerName: { type: String, required: true },
    ownerMobile: { type: String, required: true },
    propertyName: { type: String, required: true },
    propertyImages: { type: [String], default: [] },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    address: { type: String, required: true },
    isFavourite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Property Model Export
export const quicklisting =
  mongoose.models?.quicklisting ||
  mongoose.model("quicklisting", QuicklistingSchema);
