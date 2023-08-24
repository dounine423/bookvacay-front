import { useState } from "react";
import { useSelector , useDispatch } from "react-redux";
import { addHotelFilter } from "../../../features/hotels/hotelsFilter";
const SearchBox = () => {
  const name = useSelector((state) => state.hotelFilter.name);
  const [searchText , setSearchText] = useState(name || '');
  const dispatch = useDispatch();
  const handleSearch = (event) => {
    event.preventDefault();
    // Your search logic here
    // setSearchText(event.target.value);
    // dispatch(addHotelFilter({'name' : event.target.value}));
  };

  const changeText = (value) => {
    setSearchText(value);
    dispatch(addHotelFilter({type: 'name',data : value}));
  }

  return (
    <form onSubmit={handleSearch}>
      <div className="single-field relative d-flex items-center py-10">
        <input
          className="pl-50 border-light text-dark-1 h-50 rounded-8"
          type="text"
          placeholder="e.g. Best Western"
          value={searchText}
          onChange={(e) => {changeText(e.target.value)}}
          
        />
        <button type="submit" className="absolute d-flex items-center h-full">
          <i className="icon-search text-20 px-15 text-dark-1" />
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
