"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/shared/Input";
import { Properties } from "../page";

const EditPropertyPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get the property ID from the URL
  const { user } = useAuth();
  const [property, setProperty] = useState<Properties | null>(null);
  const [formData, setFormData] = useState<Partial<Properties>>({
    propertyType: "",
    placeName: "",
    rentalForm: "",
    rentalType: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    street: "",
    pet: "",
    party: "",
    cooking: "",
    smoking: "",
    VSID: "",
    isLive: true,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id && user?._id) {
      const fetchProperty = async () => {
        try {
          const response = await axios.post("/api/user/fetchpropertybyuserid", {
            userId: user._id,
          });
          console.log(response.data);
          const fetchedProperty = response.data.properties.find(
            (prop: Properties) => prop._id === id
          );

          setProperty(fetchedProperty || null);
        } catch (error) {
          console.error("Error fetching property:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, user?._id]);

  useEffect(() => {
    if (property) {
      setFormData({
        propertyType: property.propertyType,
        placeName: property.placeName,
        rentalForm: property.rentalForm,
        rentalType: property.rentalType,
        postalCode: property.postalCode,
        city: property.city,
        state: property.state,
        country: property.country,
        street: property.street,
        pet: property.pet,
        party: property.party,
        cooking: property.cooking,
        smoking: property.smoking,
        VSID: property.VSID,
        isLive: property.isLive,
      });
    }
  }, [property]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      await axios.post("/api/user/edituserproperty", {
        propertyId: id,
        updatedData: formData,
        userId: user._id,
      });
      alert("Property updated successfully");
      router.push("/author"); // Redirect to the Author page or wherever you want
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className=" text-4xl text-white font-medium">Property Type</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-x-2">
          <div className="flex  items-center justify-between">
            <div className="flex justify-around">
              <input type="radio" id="Hotel" onChange={handleChange} />
              <label htmlFor="Hotel">Hotel</label>
              <input type="radio" id="Cottage" onChange={handleChange} />
              <label htmlFor="Cottage">Cottage</label>
              <input type="radio" onChange={handleChange} />
              <label>Villa</label>
              <input type="radio" onChange={handleChange} />
              <label>Cabin</label>
              <input type="radio" onChange={handleChange} />
              <label>Farm stay</label>
              <input type="radio" onChange={handleChange} />
              <label>Houseboat</label>
              <input type="radio" onChange={handleChange} />
              <label>Lighthouse</label>
            </div>
            <div>
              <input type="radio" onChange={handleChange} />
              <label>Studio</label>
              <input type="radio" onChange={handleChange} />
              <label>Apartment</label>
              <input type="radio" onChange={handleChange} />
              <label>Penthouse</label>
              <input type="radio" onChange={handleChange} />
              <label>Detached House</label>
              <input type="radio" onChange={handleChange} />
              <label>Loft</label>
              <input type="radio" onChange={handleChange} />
              <label>Maisonette</label>
              <input type="radio" onChange={handleChange} />
              <label>Farmhouse</label>
            </div>
            <div>
              <input type="radio" onChange={handleChange} />
              <label>Holiday Homes</label>
              <input type="radio" onChange={handleChange} />
              <label>Farmstay</label>
              <input type="radio" onChange={handleChange} />
              <label>Resort</label>
              <input type="radio" onChange={handleChange} />
              <label>Lodge</label>
              <input type="radio" onChange={handleChange} />
              <label>Apart Hotel</label>
            </div>
          </div>
          <div>
            <label>
              Place Name:
              <Input
                type="text"
                name="placeName"
                value={formData?.placeName || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Rental Form:
              <Input
                type="text"
                name="rentalForm"
                value={formData?.rentalForm || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Rental Type:
              <Input
                type="text"
                name="rentalType"
                value={formData?.rentalType || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Postal Code:
              <Input
                type="text"
                name="postalCode"
                value={formData?.postalCode || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              City:
              <Input
                type="text"
                name="city"
                value={formData?.city || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              State:
              <Input
                type="text"
                name="state"
                value={formData?.state || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Country:
              <Input
                type="text"
                name="country"
                value={formData?.country || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Street:
              <Input
                type="text"
                name="street"
                value={formData?.street || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Pet Friendly:
              <Input
                type="text"
                name="pet"
                value={formData?.pet || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Party Friendly:
              <Input
                type="text"
                name="party"
                value={formData?.party || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Cooking Allowed:
              <Input
                type="text"
                name="cooking"
                value={formData?.cooking || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Smoking Allowed:
              <Input
                type="text"
                name="smoking"
                value={formData?.smoking || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              VSID:
              <Input
                type="text"
                name="VSID"
                value={formData?.VSID || ""}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Is Live:
              <input
                type="checkbox"
                name="isLive"
                checked={formData.isLive || false}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPropertyPage;
