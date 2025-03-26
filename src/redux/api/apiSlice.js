import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // Quan trọng: cho phép gửi cookies
  prepareHeaders: (headers, { getState }) => {
    // Nếu bạn có token trong localStorage hoặc từ Redux state
    const token = localStorage.getItem("token"); // hoặc từ state
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
