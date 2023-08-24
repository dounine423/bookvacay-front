import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stops : 0,
  cabins : 0,
  prices : {value:{min:0,max:0}}
};

export const flightFilterSlice = createSlice({
  name: "find-flights-filter",
  initialState,
  reducers: {
    addFlightFilter: (state, { payload }) => {
      state[payload['type']] = payload['data'];
    },
  },
});

export const { addFlightFilter } = flightFilterSlice.actions;
export default flightFilterSlice.reducer;
