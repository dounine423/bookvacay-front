import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hotelsData : {}
}

export const hotelListSlice = createSlice({
  name: "find-hotel-list",
  initialState,
  reducers: {
    addCurrentHotelList: (state, { payload }) => {
      state.hotelsData = payload;
    },
  },
});

export const { addCurrentHotelList } = hotelListSlice.actions;
export default hotelListSlice.reducer;
