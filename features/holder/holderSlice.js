import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    holder_info: null
};

export const holderSlice = createSlice({
    name: "holder-slice",
    initialState,
    reducers: {
        holderOperation: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { holderOperation } = holderSlice.actions;
export default holderSlice.reducer;
