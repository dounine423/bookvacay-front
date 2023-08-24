import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    totalMarkUp: null,
    curType: 0,
    mPagination: 1,
    mRequest: true,
    totalBillRate: null
};

export const adminMarkUp = createSlice({
    name: "admin-markup",
    initialState,
    reducers: {
        adminMarkUpAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { adminMarkUpAction } = adminMarkUp.actions;
export default adminMarkUp.reducer;
