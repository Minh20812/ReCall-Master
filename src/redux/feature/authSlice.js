import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  token: null,
};

// Safely parse JSON from localStorage
const getUserInfoFromStorage = () => {
  try {
    const userInfoString = localStorage.getItem("userInfo");
    return userInfoString ? JSON.parse(userInfoString) : null;
  } catch (error) {
    console.error("Error parsing userInfo from localStorage:", error);
    localStorage.removeItem("userInfo"); // Clean up invalid data
    return null;
  }
};

// Initialize state with values from localStorage
initialState.userInfo = getUserInfoFromStorage();
initialState.token = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // Make sure to handle various data structures that might come from different auth methods
      const { userInfo, token } = action.payload;

      // Store token
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);
      }

      // Store user info, handling different possible structures
      const normalizedUserInfo = userInfo?.userInfo
        ? userInfo.userInfo
        : userInfo;
      state.userInfo = normalizedUserInfo;

      if (normalizedUserInfo) {
        localStorage.setItem("userInfo", JSON.stringify(normalizedUserInfo));
      }

      console.log("Credentials set in Redux:", {
        token,
        userInfo: normalizedUserInfo,
      });
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
