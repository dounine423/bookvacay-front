import { configureStore } from "@reduxjs/toolkit";
import findPlaceSlice from "../features/hero/findPlaceSlice";
import hotelListSlice from "../features/hotels/hotelListSlice";
import hotelDetailSlice from "../features/hotels/hotelDetailSlice";
import flightSlice from "../features/flights/flightSlice";
import flightFilterSlice from "../features/flights/flightFilterSlice";
import hotelsFilterSlice from "../features/hotels/hotelsFilter";
import authSlice from "../features/auth/authSlice";
import activitySlice from '../features/activity/activity';
import regionSlice from '../features/region/region'
import hotelSlice from "../features/hotels/hotelSlice";
import holderSlice from "../features/holder/holderSlice";
import adminHotel from "../features/admin/adminHotel";
import adminDashboard from "../features/admin/adminDashboard";
import adminActivity from "../features/admin/adminActivity";
import adminMarkUp from "../features/admin/adminMarkUp";
import userHotel from "../features/user/userHotel";
import userActivity from "../features/user/userActivity";

export const store = configureStore({
    reducer: {
        hero: findPlaceSlice,
        hotelList: hotelListSlice,
        hotelDetail: hotelDetailSlice,
        hotelFilter: hotelsFilterSlice,
        flightList: flightSlice,
        flightFilter: flightFilterSlice,
        auth: authSlice,
        activity: activitySlice,
        region: regionSlice,
        holder: holderSlice,
        hotel: hotelSlice,
        userActivity,
        userHotel,
        adminHotel,
        adminDashboard,
        adminActivity,
        adminMarkUp,
    },
});
