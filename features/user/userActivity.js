import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    totalActivity: null,
    aRequest: true,
    curStatus: 0,
    aPagination: 1
};

export const userActivity = createSlice({
    name: "user-activity",
    initialState,
    reducers: {
        userActivityAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { userActivityAction } = userActivity.actions;
export default userActivity.reducer;
