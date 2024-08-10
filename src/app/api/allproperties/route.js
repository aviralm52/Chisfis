import { connectDb } from "../../../helper/db";
import { NextRequest, NextResponse } from "next/server";
import {NextApiRequest} from "next";
import { Property } from "@/models/listing";

connectDb();

export async function GET(req) {

    const url = req.url;
    const urlList = url.split('limit=');
    const limit = urlList[1];
    const queryLimit = limit ? parseInt(limit, 10): undefined;

    try {
<<<<<<< HEAD
        const allProperties = await Property.find().limit(4);
=======
        // const allProperties = await Property.find().limit(queryLimit || 0);     // 0 means no limit
        const allProperties = await Property.aggregate([
            {$sample: {size: queryLimit || 0}}
        ]);     // 0 means no limit
>>>>>>> 980138046dd5ef208e08ec5f6ac5e8467d6339a6

        return NextResponse.json(allProperties);
    } catch (error) {
        console.error("Error fetching properties: ", error);

        return NextResponse.json({
            message: "Failed to fetch properties from the database",
        });
    }
}



