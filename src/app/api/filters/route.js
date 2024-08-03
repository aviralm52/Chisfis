import { connectDb } from "../../../helper/db";
import { NextResponse } from "next/server";
import { Property } from "@/models/listing";

connectDb();

export async function POST(request) {
  try {
    const filterCriteria = await request.json();
    console.log("filterCriteria: ", filterCriteria);



    const rentalForm = filterCriteria.rentalForm;
    const propertyType = filterCriteria.propertyType;
    const minValue = filterCriteria.minPrice;
    const maxValue = filterCriteria.maxPrice;
    const bedrooms = filterCriteria.bedrooms;
    const bathrooms = filterCriteria.bathrooms;
    const beds = filterCriteria.beds;
    const country = filterCriteria.country;

    console.log(
      rentalForm,
      propertyType,
      bedrooms,
      bathrooms,
      beds,
      minValue,
      maxValue,
      country
    );
    let results;
    if (
      rentalForm &&
      propertyType &&
      bedrooms &&
      bathrooms &&
      beds &&
      minValue &&
      maxValue &&
      country
    ) {
      console.log("if ke andar vala");
      results = await Property.find({
        $and: [
          {country: country},
          { rentalForm: rentalForm },
          { propertyType: propertyType },
          {
            basePrice: {
              $elemMatch: {
                $gte: minValue,
                $lte: maxValue,
              },
            },
          },
          {
            bedrooms: {
              $elemMatch: {
                $gte: bedrooms,
              },
            },
          },
          {
            bathroom: {
              $elemMatch: {
                $gte: bathrooms,
              },
            },
          },
          {
            beds: {
              $elemMatch: {
                $gte: beds,
              },
            },
          },
        ],
      });
    } else {
      console.log( 
        "else ke andar vala",
        country,
        rentalForm,
        propertyType,
        minValue,
        maxValue,
        bedrooms,
        bathrooms,
        beds,
        country
      );
      results = await Property.find({
        $or: [
          {country: country},
          { rentalForm: rentalForm },
          { propertyType: propertyType },
          // {
          //   basePrice: {
          //     $elemMatch: {
          //       $gte: minValue,
          //       $lte: maxValue,
          //     },
          //   },
          // },
          {
            bedrooms: {
              $elemMatch: {
                $gte: bedrooms,
              },
            },
          },
          {
            bathroom: {
              $elemMatch: {
                $gte: bathrooms,
              },
            },
          },
          {
            beds: {
              $elemMatch: {
                $gte: beds,
              },
            },
          },
        ],
      });
    }

    // const query = {};

    // if (rentalForm) {
    //   query.rentalForm = rentalForm;
    // }

    // if (propertyType) {
    //   query.propertyType = propertyType;
    // }

    // if (minValue !== undefined || maxValue !== undefined) {
    //   query.basePrice = {
    //     $elemMatch: {
    //       ...(minValue !== undefined && { $gte: minValue }),
    //       ...(maxValue !== undefined && { $lte: maxValue }),
    //     },
    //   };
    // }

    // if (bedrooms !== undefined) {
    //   query.bedrooms = {
    //     $elemMatch: {
    //       $gte: bedrooms,
    //     },
    //   };
    // }

    // if (bathrooms !== undefined) {
    //   query.bathroom = {
    //     $elemMatch: {
    //       $gte: bathrooms,
    //     },
    //   };
    // }

    // if (beds !== undefined) {
    //   query.beds = {
    //     $elemMatch: {
    //       $gte: beds,
    //     },
    //   };
    // }

    // console.log("query: ", query);
    // const results = await Property.find().lean();

    console.log("results: ", results.length, results);
    console.log(NextResponse.json(results));

    console.log("results: ", results.length, results);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error filtering properties: ", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// function buildQuery(criteria) {
//   const query = {};

//   // Rental Form
//   if (criteria.rentalForm) {
//     query.rentalForm = criteria.rentalForm;
//   }

//   // Price Range
//   if (criteria.minPrice && criteria.maxPrice) {
//     query.basePrice = { $gte: criteria.minPrice, $lte: criteria.maxPrice };
//   } else if (criteria.minPrice) {
//     query.basePrice = { $gte: criteria.minPrice };
//   } else if (criteria.maxPrice) {
//     query.basePrice = { $lte: criteria.maxPrice };
//   }

//   // Property Type
//   if (criteria.propertyType) {
//     query.propertyType = criteria.propertyType;
//   }

//   // Number of Bedrooms
//   if (criteria.minBedrooms && criteria.maxBedrooms) {
//     query.bedrooms = { $gte: criteria.minBedrooms, $lte: criteria.maxBedrooms };
//   } else if (criteria.minBedrooms) {
//     query.bedrooms = { $gte: criteria.minBedrooms };
//   } else if (criteria.maxBedrooms) {
//     query.bedrooms = { $lte: criteria.maxBedrooms };
//   }

//   if (criteria.bathrooms) {
//     query.bathrooms = { $gte: criteria.bathrooms };
//   }

//   if (criteria.additionalRules) {
//     query.additionalRules = { $in: criteria.additionalRules };
//   }

//   if (criteria.placeType) {
//     query.placeName = { $in: criteria.placeType };
//   }

//   return query;
// }
