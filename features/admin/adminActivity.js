import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
    totalActivity: null,
    aPagination: 1,
    aRequest: true,
    curStatus: 0
};

export const adminActivity = createSlice({
    name: "admin-activity",
    initialState,
    reducers: {
        adminActivityAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { adminActivityAction } = adminActivity.actions;
export default adminActivity.reducer;
