import axios from "axios";
import { LocationFormValues } from "./schema/cart-schema";

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<LocationFormValues> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat,
          lon: lng,
          format: "json",
          addressdetails: 1,
        },
      }
    );

    const { address } = response.data;
    return {
      address: address.road || address.street || "Unknown Street",
      city: address.city || address.town || address.village || "Unknown City",
      state: address.state || address.region || "Unknown State",
      postalCode: address.postcode || "Unknown Postal Code",
      country: address.country || "Unknown Country",
    };
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    throw new Error("Couldn’t fetch location details");
  }
};
