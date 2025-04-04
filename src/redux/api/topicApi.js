import apiSlice from "./apiSlice";
import { TOPICS_URL } from "../constants";

export const topicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get topics with filters and pagination
    getTopics: builder.query({
      query: () => ({
        url: TOPICS_URL,
      }),
      providesTags: ["Topic"],
    }),

    // Create a new topic
    createTopic: builder.mutation({
      query: (data) => ({
        url: TOPICS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "topic", id: "LIST" }],
    }),

    // Delete a topic
    deleteTopic: builder.mutation({
      query: (topicId) => ({
        url: `${TOPICS_URL}/${topicId}`,
        method: "DELETE",
      }),
    }),

    // Get topic details by ID
    getTopicDetails: builder.query({
      query: (id) => ({
        url: `${TOPICS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "topic", id }],
      keepUnusedDataFor: 300,
    }),

    // Update a topic
    updateTopic: builder.mutation({
      query: (data) => ({
        url: `${TOPICS_URL}/${data.topicId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Topic"],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useCreateTopicMutation,
  useDeleteTopicMutation,
  useGetTopicDetailsQuery,
  useUpdateTopicMutation,
  useLazyGetTopicsQuery,
} = topicApi;
