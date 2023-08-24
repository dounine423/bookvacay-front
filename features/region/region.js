import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    countries: null,
    destinations: null,
    facilities: null,
    currencies: null,
    currency: "ZAR",
    currencyInfo: null
};

export const regionSlice = createSlice({
    name: "region-slice",
    initialState,
    reducers: {
        regionAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { regionAction } = regionSlice.actions;
export default regionSlice.reducer;
