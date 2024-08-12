import {connectDb} from "@/helper/db";
import { NextResponse } from "next/server";
import { Property } from "@/models/listing";

connectDb();

export async function GET(req) {

    const url = new URL(req.url)
    const pathNameList = url.pathname.split('/');
    const referer = req.headers.get('referer');
    const guestsCount = parseInt(referer.split('guests=')[1]) || 0;
    const searchedCountry = pathNameList[pathNameList.length - 1];

    const searchRegex = new RegExp(searchedCountry, 'i');
    const searchedProperties = await Property.find({
        // $or: [
        //     {city: searchRegex},
        //     {country: searchRegex}
        // ]
        $and: [
            {
                $or: [
                    { city: searchRegex },
                    { country: searchRegex },
                    {state: searchRegex}
                ]
            },
            { "guests.0": { $gte: guestsCount } } // Adjust this according to how you store guests in your schema
        ]
    }).limit(12);

    try {
        console.log('inside try in specific country')
        return NextResponse.json(searchedProperties);
    } catch (error) {
        console.log("error: ", error);
        return NextResponse.json({
            message: "failed to fetch user from route",
        });
    }
}
