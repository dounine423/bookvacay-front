import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
    statistics: null,
    sRequest: true,
    curYear: moment().format('YYYY'),
    curMonth: moment().format('M'),
    curGroup: 1,
    curType: 0,
    statisticsFlag: true,
    amountInfo: null,
};

export const adminDashboard = createSlice({
    name: "admin-dashboard",
    initialState,
    reducers: {
        adminDashBoardAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { adminDashBoardAction } = adminDashboard.actions;
export default adminDashboard.reducer;
