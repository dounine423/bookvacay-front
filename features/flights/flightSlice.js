import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flightList : {}
};

export const flightSlice = createSlice({
  name: "find-flights",
  initialState,
  reducers: {
    addFlightList: (state, { payload }) => {
      state.flightList = payload;
    },
  },
});

export const { addFlightList } = flightSlice.actions;
export default flightSlice.reducer;
