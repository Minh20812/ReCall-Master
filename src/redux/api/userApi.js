import apiSlice from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      // keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      // keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    searchUsersByEmail: builder.query({
      query: (email) => ({
        url: `api/users/search?email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
      // Add error handling
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || "Failed to search users",
        };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useSearchUsersByEmailQuery,
} = userApi;
