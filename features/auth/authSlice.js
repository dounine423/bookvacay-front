import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  LoggedIn: false,
  userInfo: null,
  mode: "develop"
};

export const authSlice = createSlice({
  name: "find-auth",
  initialState,
  reducers: {
    addAuth: (state, { payload }) => {
      state[payload['type']] = payload['data'];
    },
  },
});

export const { addAuth } = authSlice.actions;
export default authSlice.reducer;
