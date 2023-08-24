import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hotel: null,
    filter: null,
    hPagination: 1,
    hRequest: true
};

export const adminHotel = createSlice({
    name: "admin-hotel",
    initialState,
    reducers: {
        adminHotelAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { adminHotelAction } = adminHotel.actions;
export default adminHotel.reducer;
