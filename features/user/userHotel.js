import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    totalHotel: null,
    hRequest: true,
    curStatus: 0,
    hPagination:1
};

export const userHotel = createSlice({
    name: "user-hotel",
    initialState,
    reducers: {
        userHotelAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { userHotelAction } = userHotel.actions;
export default userHotel.reducer;
