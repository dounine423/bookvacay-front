import { useEffect, useState } from "react";
import AminitesFilter from "./sidebar/AminitesFilter";
import RatingsFilter from "./sidebar/RatingsFilter";
import PriceSlider from "./sidebar/PriceSlider";
import FacilityFilter from "./sidebar/FacilityFilter";

// import DealsFilter from "../sidebar/DealsFilter";
// import Map from "../sidebar/Map";
// import SearchBox from "../sidebar/SearchBox";
// import PopularFilters from "../sidebar/PopularFilters";
// import GuestRatingFilters from "../sidebar/GuestRatingFilters";
// import StyleFilter from "../sidebar/StyleFilter";
// import NeighborhoddFilter from "../sidebar/NeighborhoddFilter";

const Sidebar = ({ getValue, filterData, setFilterData, getFacility, facilities }) => {

  const [price, setPrice] = useState({ min: filterData?.min, max: filterData?.max })
  const [category, setCategory] = useState(filterData?.category)
  const [board, setBoard] = useState(filterData?.board)
  const [facility, setFacility] = useState(facilities)

  useEffect(() => {
    let timer = setTimeout(() => {
      let filter = {
        min: price.min,
        max: price.max,
        category,
        board
      }
      if (filterData.max == price.max && filterData.min == price.min && category == filterData.category && JSON.stringify(board) == JSON.stringify(filterData.board) && JSON.stringify(facilities) == JSON.stringify(facility)) {

      } else {
        setFilterData(filter)
        getFacility(facility)
        getValue(true)
      }
    }, 1500)
    return () => { clearInterval(timer) }
  }, [category, price, board, facility])

  return (
    <>
      <h6 className="text-25" >Filter By:</h6>
      <div className="sidebar__item pb-30">
        <h5 className="text-20 fw-500 mb-10">Nightly Price</h5>
        <div className="row x-gap-10 y-gap-30">
          <div className="col-12 mt-10">
            <PriceSlider getValue={setPrice} />
          </div>
        </div>
      </div>

      {
        board != null ? (
          <div className="sidebar__item">
            <h5 className="text-20 fw-500 mb-10">Popular Filters</h5>
            <div className="sidebar-checkbox">
              <AminitesFilter getBoard={setBoard} />
            </div>
          </div>
        ) : null
      }
      <div className="sidebar__item">
        <h5 className="text-20 fw-500 mb-10">Star Rating</h5>
        <div className="row x-gap-10 y-gap-10 pt-10">
          <RatingsFilter getCurValue={setCategory} />
        </div>
      </div>
      {/* <div className="sidebar__item">
        <div className="row x-gap-10 y-gap-10 pt-10">
          <FacilityFilter getFacility={setFacility} />
        </div>
      </div> */}
    </>
  );
};

export default Sidebar;
