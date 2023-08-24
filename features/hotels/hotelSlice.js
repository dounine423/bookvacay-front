import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    imageUrl: "http://photos.hotelbeds.com/giata/bigger/",
    pagination: 1,
    request: true,
    indexes: null,
    filter: null,
    availability: null,
    upSellingActivity: null,
    hotelReserve: null,
    curHotelAvail: null,
    total_avail: null,
    total_content: null,
    hotelBook: null,
    hotelTolerance: null,
    index: null,
    defaultLocation: [
        {
            "id": 0,
            "name": "Eastern Cape-Port Elizabeth",
            "code": "PTE",
            "type": 1,
            "content": "South Africa"
        },
        {
            "id": 2,
            "name": "KwaZulu Natal - Durban",
            "code": "KZN",
            "type": 1,
            "content": "South Africa"
        },
        {
            "id": 3,
            "name": "Limpopo",
            "code": "LMP",
            "type": 1,
            "content": "South Africa"
        },
        {
            "id": 4,
            "name": "Mpumalanga-Kruger Area",
            "code": "MPM",
            "type": 1,
            "content": "South Africa"
        }
    ],
    defaultFilter: {
        max: 2500,
        min: 1,
        category: null,
        board: []
    },
    defaultImg: "/img/general/default.jpg"
};

export const hotelSlice = createSlice({
    name: "hotel-slice",
    initialState,
    reducers: {
        hotelOperation: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        },
    },
});

export const { hotelOperation } = hotelSlice.actions;
export default hotelSlice.reducer;
