"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/shared/Input";
import { Properties } from "../page";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { MdArrowDropDown, MdArrowDropUp, MdArrowRight } from "react-icons/md";

const EditPropertyPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get the property ID from the URL
  const { user } = useAuth();
  const [property, setProperty] = useState<Properties | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [numberOfPortions, setNumberOfPortions] = useState<number>(1);

  useEffect(() => {
    if (id && user?._id) {
      const fetchProperty = async () => {
        try {
          const response = await axios.post("/api/user/fetchpropertybyuserid", {
            userId: user._id,
          });
          const fetchedProperty = response.data.properties.find(
            (prop: Properties) => prop._id === id
          );
          setProperty(fetchedProperty || null);
          setNumberOfPortions(fetchedProperty?.numberOfPortions || 1);
        } catch (error) {
          console.error("Error fetching property:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, user?._id]);

  const [formData, setFormData] = useState<Partial<Properties>>({
    VSID: property?.VSID,
    rentalType: property?.rentalType,

    propertyType: property?.propertyType,
    placeName: property?.placeName,
    rentalForm: property?.rentalForm,
    numberOfPortions: property?.numberOfPortions,

    street: property?.street,
    postalCode: property?.postalCode,
    city: property?.city,
    state: property?.state,
    country: property?.country,

    portionName: property?.portionName,
    portionSize: property?.portionSize,
    guests: property?.guests,
    bedrooms: property?.bedrooms,
    beds: property?.beds,
    bathroom: property?.bathroom,
    kitchen: property?.kitchen,
    childrenAge: property?.childrenAge,

    basePrice: property?.basePrice,
    weekendPrice: property?.weekendPrice,
    monthlyDiscount: property?.monthlyDiscount,

    generalAmenities: property?.generalAmenities,
    otherAmenities: property?.otherAmenities,
    safeAmenities: property?.safeAmenities,

    smoking: property?.smoking,
    pet: property?.pet,
    party: property?.party,
    cooking: property?.cooking,
    additionalRules: property?.additionalRules,

    reviews: property?.reviews,

    propertyCoverFileUrl: property?.propertyCoverFileUrl,
    propertyPictureUrls: property?.propertyPictureUrls,
    portionCoverFileUrls: property?.portionCoverFileUrls,
    portionPictureUrls: property?.portionPictureUrls,

    night: property?.night,
    time: property?.time,
    datesPerPortion: property?.datesPerPortion,

    isLive: property?.isLive,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        VSID: property.VSID,
        rentalType: property.rentalType,

        propertyType: property.propertyType,
        placeName: property.placeName,
        rentalForm: property.rentalForm,
        numberOfPortions: property.numberOfPortions,

        street: property.street,
        postalCode: property.postalCode,
        city: property.city,
        state: property.state,
        country: property.country,

        portionName: property.portionName,
        portionSize: property.portionSize,
        guests: property.guests,
        bedrooms: property.bedrooms,
        beds: property.beds,
        bathroom: property.bathroom,
        kitchen: property.kitchen,
        childrenAge: property.childrenAge,

        basePrice: property.basePrice,
        weekendPrice: property.weekendPrice,
        monthlyDiscount: property.monthlyDiscount,

        smoking: property.smoking,
        pet: property.pet,
        party: property.party,
        cooking: property.cooking,
        additionalRules: property.additionalRules,

        reviews: property.reviews,

        night: property.night,
        time: property.time,
        datesPerPortion: property.datesPerPortion,

        isLive: property.isLive,
      });
    }
  }, [property]);

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const handleChange = (e: any) => {
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

  // if (loading) return <div>Loading...</div>;

  const [isPortionOpen, setIsPortionOpen] = useState<boolean[]>(() =>
    Array.from({ length: numberOfPortions }, () => false)
  );

  return (
    <div className="max-w-6xl mx-auto ">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-x-2 gap-y-4 mt-4">
          <div className="text-xl dark:text-white font-medium">
            <label>
              VSID
              <Input
                type="text"
                name="VSID"
                value={formData?.VSID || ""}
                onChange={handleChange}
                disabled
              />
            </label>
          </div>

          <div className=" text-black">
            <h1 className="text-xl dark:text-white font-medium">
              Property Type
            </h1>
            <select
              name="propertyType"
              id="propertyType"
              // value={selectedPropertyType}
              value={formData.propertyType}
              // onChange={(e) => setSelectedPropertyType(e.target.value)}
              onChange={(e) => handleChange(e)}
              className=" dark:text-white border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 rounded-lg p-2 w-full"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Hotel"
              >
                Hotel
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Cottage"
              >
                Cottage
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Villa"
              >
                Villa
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Cabin"
              >
                Cabin
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Farm stay"
              >
                Farm stay
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Houseboat"
              >
                Houseboat
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Lighthouse"
              >
                Lighthouse
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Studio"
              >
                Studio
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Apartment"
              >
                Apartment
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Penthouse"
              >
                Penthouse
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Detached House"
              >
                Detached House
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Loft"
              >
                Loft
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Maisonette"
              >
                Maisonette
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Farmhouse"
              >
                Farmhouse
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Holiday Homes"
              >
                Holiday Homes
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Farmstay"
              >
                Farmstay
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Resort"
              >
                Resort
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Lodge"
              >
                Lodge
              </option>
              <option
                className=" text-black dark:text-white dark:bg-neutral-800"
                value="Apart Hotel"
              >
                Apart Hotel
              </option>
            </select>
          </div>

          <div>
            <label className=" text-xl dark:text-white font-medium">
              Place Name
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
              Rental Form
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
            <label className=" text-xl">
              Is Live:
              <input
                type="checkbox"
                name="isLive"
                checked={formData.isLive || false}
                onChange={handleChange}
                className="p-4 rounded-md mx-2 cursor-pointer"
              />
            </label>
          </div>

          {Array.from({
            length: numberOfPortions > 1 ? numberOfPortions : 0,
          }).map((_, index) => {
            return (
              <div className=" flex flex-col space-y-4 my-4">
                <h1
                  className=" text-2xl font-medium dark:text-white text-black cursor-pointer inline-flex items-center space-x-2"
                  onClick={() =>
                    setIsPortionOpen((prev) => {
                      const newIsPortionOpen = [...prev];
                      newIsPortionOpen[index] = !newIsPortionOpen[index];
                      return newIsPortionOpen;
                    })
                  }
                >
                  Portion {index + 1} {isPortionOpen[index] ? <MdArrowDropDown />: <MdArrowRight  />}
                </h1>

                {isPortionOpen[index] && (
                  <div className=" flex flex-col space-y-4">
                    <div>
                      <label htmlFor="portionName">
                        Portion&apos;s Name
                        <Input
                          type="text"
                          name="cooking"
                          value={formData?.portionName?.at(index) || ""}
                          onChange={(e) => {
                            const newFormData = { ...formData };
                            // newFormData?.portionName?[index] = e.target.value;
                            newFormData?.portionName?.splice(
                              index,
                              1,
                              e.target.value
                            );
                            setFormData(newFormData);
                          }}
                        />
                      </label>
                    </div>

                    <div className=" flex space-x-4">
                      <div>
                        <label htmlFor="portionSize">
                          Portion&apos;s Size
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="portionSize"
                            value={formData?.portionSize?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.portionSize?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="guests">
                          Number Of Guests
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="guests"
                            value={formData?.guests?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.guests?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="bedrooms">
                          Number Of Bedrooms
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="bedrooms"
                            value={formData?.bedrooms?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.bedrooms?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="beds">
                          Number Of Beds
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="beds"
                            value={formData?.beds?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.beds?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="bathroom">
                          Number Of Bathrooms
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="bathroom"
                            value={formData?.bathroom?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.bathroom?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className=" flex space-x-4">
                      <div>
                        <label htmlFor="kitchen">
                          Number Of Kitchen
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="kitchen"
                            value={formData?.kitchen?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.kitchen?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="childrenAge">
                          Children&apos;s Age
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="childrenAge"
                            value={formData?.childrenAge?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.childrenAge?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="basePrice">
                          Base Price Of Portion {index + 1}
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="basePrice"
                            value={formData?.basePrice?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.basePrice?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="weekendPrice">
                          Weekend Price Of Portion {index + 1}
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="weekendPrice"
                            value={formData?.weekendPrice?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.weekendPrice?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="monthlyDiscount">
                          Monthly Discount For Portion {index + 1}
                          <Input
                            className=" bg-transparent w-full rounded-2xl"
                            type="number"
                            name="monthlyDiscount"
                            value={formData?.monthlyDiscount?.at(index) || ""}
                            onChange={(e) => {
                              const newFormData = { ...formData };
                              newFormData?.monthlyDiscount?.splice(
                                index,
                                1,
                                parseInt(e.target.value)
                              );
                              setFormData(newFormData);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className=" flex justify-center my-4">
          <button
            type="submit"
            className=" p-4 rounded-3xl items-center disabled:bg-opacity-70 bg-primary-6000 hover:bg-primary-700 text-neutral-50"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyPage;
