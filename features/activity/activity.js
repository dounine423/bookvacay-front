import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activityReserve: [],
    availability: null,
    pagination: 1,
    total_avail: null,
    request: true,
    activityBook: null,
    index: null,
    curActivity: null,
    markUp: null,
    hotelName: null
};

export const activityBook = createSlice({
    name: "activity-book",
    initialState,
    reducers: {
        activityOperation: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },

    },
});

export const { activityOperation } = activityBook.actions;
export default activityBook.reducer;
