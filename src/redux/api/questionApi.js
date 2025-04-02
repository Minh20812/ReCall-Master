import apiSlice from "./apiSlice";
import { QUESTIONS_URL } from "../constants";

export const questionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get questions with filters and pagination
    getQuestions: builder.query({
      query: (params) => {
        const { keyword, topic, difficulty, type, page, pageSize } =
          params || {};

        // Build query string with available parameters
        let queryString = "";
        if (keyword) queryString += `keyword=${encodeURIComponent(keyword)}&`;
        if (topic) queryString += `topic=${encodeURIComponent(topic)}&`;
        if (difficulty) queryString += `difficulty=${difficulty}&`;
        if (type) queryString += `type=${encodeURIComponent(type)}&`;
        if (page) queryString += `page=${page}&`;
        if (pageSize) queryString += `pageSize=${pageSize}&`;

        // Remove trailing & if exists
        queryString = queryString ? `?${queryString.slice(0, -1)}` : "";

        return {
          url: `${QUESTIONS_URL}${queryString}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.questions.map(({ _id }) => ({
                type: "Question",
                id: _id,
              })),
              { type: "Question", id: "LIST" },
            ]
          : [{ type: "Question", id: "LIST" }],
      keepUnusedDataFor: 60, // Cache for 60 seconds
    }), 

    // Create a new question
    createQuestion: builder.mutation({
      query: (data) => ({
        url: QUESTIONS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Question", id: "LIST" }],
    }),

    // Delete a question
    deleteQuestion: builder.mutation({
      query: (questionId) => ({
        url: `${QUESTIONS_URL}/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, questionId) => [
        { type: "Question", id: questionId },
        { type: "Question", id: "LIST" },
      ],
    }),

    // Get question details by ID
    getQuestionDetails: builder.query({
      query: (id) => ({
        url: `${QUESTIONS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Question", id }],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Update a question
    updateQuestion: builder.mutation({
      query: (data) => ({
        url: `${QUESTIONS_URL}/${data.questionId || data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Question", id: data.questionId || data._id },
        { type: "Question", id: "LIST" },
      ],
    }),

    // Get questions by topic
    getQuestionsByTopic: builder.query({
      query: (topicId) => ({
        url: `${QUESTIONS_URL}/topic/${topicId}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Question", id: _id })),
              { type: "Question", id: `TOPIC-${result[0]?.topic}` },
            ]
          : [],
      keepUnusedDataFor: 120, // Cache for 2 minutes
    }),

    // Get random questions for quiz
    getRandomQuestions: builder.query({
      query: (params) => {
        const { topic, count, difficulty } = params || {};

        let queryString = "";
        if (topic) queryString += `topic=${encodeURIComponent(topic)}&`;
        if (count) queryString += `count=${count}&`;
        if (difficulty) queryString += `difficulty=${difficulty}&`;

        // Remove trailing & if exists
        queryString = queryString ? `?${queryString.slice(0, -1)}` : "";

        return {
          url: `${QUESTIONS_URL}/random${queryString}`,
        };
      },
      // Don't provide tags as this is meant to be random data
      keepUnusedDataFor: 0, // Don't cache random data
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
  useGetQuestionDetailsQuery,
  useGetQuestionsByTopicQuery,
  useGetRandomQuestionsQuery,
} = questionApi;
