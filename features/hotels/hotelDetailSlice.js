import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hotel : {},
  photos : {},
  descriptions : [],
  reviews : {},
  availableRooms : {}
}

export const hotelDetailSlice = createSlice({
  name: "find-hotel-detail",
  initialState,
  reducers: {
    addCurrentHotelDetail: (state, { payload}) => {
      state[payload['type']] = payload['data'];
    },
  },
});

export const { addCurrentHotelDetail } = hotelDetailSlice.actions;
export default hotelDetailSlice.reducer;
