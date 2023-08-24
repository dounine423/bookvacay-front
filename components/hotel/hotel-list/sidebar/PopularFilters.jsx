import { useState } from "react";
import { useSelector , useDispatch } from "react-redux";
import { addHotelFilter } from "../../../features/hotels/hotelsFilter";

const popularFilters = () => {
  const dispatch = useDispatch();

  const popular = useSelector((state) => state.hotelFilter.popular);
  // const [filts , setFilts] = useState({
  //   'hotel_include_breakfast' : 0,
  //   'hotel_5_stars' : 0
  // })
  const [filt ,setFilt] = useState(popular);
  const filters = [
    { label: "Breakfast Included", key: 'hotel_include_breakfast' ,value: 0},
    // { label: "Romantic", count: 45 },is_city_center
    // { label: "Airport Transfer", count: 21 },is_genius_deal
    // { label: "WiFi Included", count: 78 },
    // { label: "5 Star", key : 'hotel_5_stars' , value : 0},
  ];

  const changeFilter = () => {
    let is_breakfast = filt == 0? 1 : 0;
    setFilt(is_breakfast);
    dispatch(addHotelFilter({type:'popular',data : is_breakfast}));
    console.log(popular);
  }
  
  
  return (
    <>
      {filters.map((filter, index) => (
        <div key={index} className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" value={filt} onChange={changeFilter} checked={filt==0?"":"checked"}/>
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-15 ml-10">{filter.label}</div>
            </div>
          </div>
          {/* <div className="col-auto">
            <div className="text-15 text-light-1">{filter.count}</div>
          </div> */}
        </div>
      ))}
    </>
  );
};

export default popularFilters;
