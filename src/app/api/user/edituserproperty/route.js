import { Property } from "../../../../models/listing";
import { connectDb } from "../../../../helper/db";
import { ObjectId } from "mongodb";

connectDb();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { propertyId, updatedData, userId } = reqBody;

    if (!propertyId || !updatedData || !userId) {
      return new Response(
        JSON.stringify({ error: "Property ID, updated data, and user ID are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Optionally check if the user is the owner of the property
    // This part can be added if needed to ensure the user has permissions
    // const property = await Property.findOne({ _id: new ObjectId(propertyId) });
    // if (property?.userId !== userId) {
    //   return new Response(
    //     JSON.stringify({ error: 'Unauthorized' }),
    //     { status: 403, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    const property = await Property.findOneAndUpdate(
      { _id: new ObjectId(propertyId) },
      { $set: updatedData },
      { new: true }
    );

    if (!property) {
      return new Response(
        JSON.stringify({ message: "Property not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ property }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
