import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  deals: 0,
  popular: 0,
  prices: { min: 100, max: 1700 },
  board: [
    { name: "Room Only", code: 'RO', checked: false },
    { name: "Self Catering", code: 'SC', checked: false },
    { name: "Bed And Breakfast", code: 'BB', checked: false },
    { name: "Lunch Included", code: 'CO', checked: false },
    { name: "Dinner Included", code: 'CE', checked: false },
  ],
  category: null
};

export const hotelsFilterSlice = createSlice({
  name: "find-flights-filter",
  initialState,
  reducers: {
    addHotelFilter: (state, { payload }) => {
      state[payload['type']] = payload['data'];
    },
  },
});

export const { addHotelFilter } = hotelsFilterSlice.actions;
export default hotelsFilterSlice.reducer;
