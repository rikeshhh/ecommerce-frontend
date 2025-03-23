/* eslint-disable */

import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const fetchActiveAds = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/ads/public?limit=10`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched public ads data:", response.data);
    return response.data;
  } catch (error) {
    const err = error as any;
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch active ads";
    console.error("Error fetching active ads:", errorMessage);
    throw new Error(errorMessage);
  }
};
