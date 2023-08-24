import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tabs: [
    { id: 1, name: "Hotel", icon: "icon-bed" , image:"" , searchBox : "" , searchURL : "" },
    { id: 2, name: "Tour", icon: "icon-destination" , image:"" , searchBox : "" , searchURL : "" },
    { id: 3, name: "Activity", icon: "icon-ski" , image:"" , searchBox : "" , searchURL : "" },
    { id: 4, name: "Holyday Rentals", icon: "icon-home" , image:"" , searchBox : "" , searchURL : "" },
    { id: 5, name: "Car", icon: "icon-car" , image:"" , searchBox : "" , searchURL : "" },
    { id: 6, name: "Cruise", icon: "icon-yatch" , image:"" , searchBox : "" , searchURL : "" },
    { id: 7, name: "Flights", icon: "icon-tickets" , image:"" , searchBox : "" , searchURL : "" },
  ],
  currentTab: "Hotel",
};

export const findPlaceSlice = createSlice({
  name: "find-place",
  initialState,
  reducers: {
    addCurrentTab: (state, { payload }) => {
      state.currentTab = payload;
    },
  },
});

export const { addCurrentTab } = findPlaceSlice.actions;
export default findPlaceSlice.reducer;
