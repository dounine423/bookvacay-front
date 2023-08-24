import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { API } from '../../../pages/api/api'
import { hotelOperation } from "../../../features/hotels/hotelSlice";

const LocationSearch = ({ getLocation, location }) => {
  const dispatch = useDispatch()
  const { indexes, defaultLocation } = useSelector(state => state.hotel)
  const mySwal = withReactContent(Swal)
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [locationData, setLocationData] = useState([])
  const [loading, setLoading] = useState(false)
  const [intervalFlag, setIFlag] = useState(null)
  const override = {
    display: "block",
    margin: "0 auto",
    color: "red"
  };

  const searchDesti = (name) => {
    setSearchValue(name)
    if (name != "") {
      let request = {
        index: name
      }
      setLoading(true)
      clearInterval(intervalFlag)
      let interval = setTimeout(() => {
        getFilterData(request)
      }, 1500)
      setIFlag(interval)
    }
  }

  const handleOptionClick = (item) => {
    setSearchValue(item.name);
    setSelectedItem(item);
    getLocation(item)
  };

  const getFilterData = async (req) => {
    const { data } = await API.post('/getHotelIndexes', req)
    if (data.success) {
      setLocationData([...data.result])
      dispatch(hotelOperation({ type: 'indexes', data: data.result }))
    } else {
      mySwal.fire('Error', data.message, 'error')
    }
    setLoading(false)
  }

  const renderData = (location) => {
    const { type, name, content } = location
    if (type == 1) {
      return (
        <>
          <div className="icon-location-2 text-light-1 text-20 pt-4" />
          <div className="ml-10">
            <div className="text-15 lh-12 fw-500 js-search-option-target">
              {name}
            </div>
            <div className="text-14 lh-12 text-light-1 mt-5">
              {content}
            </div>
          </div>
        </>
      )
    }
    else {
      return (
        <>
          <div className="icon-bed text-light-1 text-20 pt-4" />
          <div className="ml-10">
            <div className="text-15 lh-12 fw-500 js-search-option-target">
              {name}
            </div>
            <div className="text-14 lh-12 text-light-1 mt-5">
              {content}
            </div>
          </div>
        </>
      )
    }
  }

  useEffect(() => {
    if (location) {
      setSearchValue(location.name)
      setSelectedItem(location)
    }
    if (indexes == null)
      setLocationData([...defaultLocation])
    else
      setLocationData([...indexes])
  }, [location])

  return (
    <>
      <div className="searchMenu-loc py-10 lg:py-20  js-form-dd js-liverSearch">
        <div
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          data-bs-offset="0,22"
        >
          <h4 className="text-15 fw-500 ls-2 lh-16 px-20">Location</h4>
          <div className="text-15 text-light-1 ls-2 lh-16 px-20">
            <div className="d-flex">
              {
                selectedItem ? (<i className={(selectedItem.type == 0 ? "icon-bed" : "icon-location-2 ") + (" text-20 mr-10 mt-5")} />) : null
              }

              <input
                autoComplete="off"
                type="search"
                placeholder="Where are you going?"
                className="js-search js-dd-focus"
                value={searchValue}
                onChange={(e) => searchDesti(e.target.value)}
              />
            </div>

          </div>
        </div>

        <div className="shadow-2 dropdown-menu min-width-400">
          <div className="bg-white px-20 py-20 sm:px-0 sm:py-15 rounded-4" style={{ overflowY: 'auto', height: '300px' }} >
            {
              loading ? (
                <ClipLoader loading={true} size={50} cssOverride={override} />
              ) : (
                <ul className="y-gap-5 js-results">
                  {locationData.map((destination, destiId) => (
                    <li
                      className={`-link d-block col-12 text-left rounded-4 px-20 py-15 js-search-option mb-1 ${selectedItem && selectedItem.code === destination.code ? "active" : ""
                        }`}
                      key={destiId}
                      role="button"
                      onClick={() => handleOptionClick(destination)}
                    >
                      <div className="d-flex">
                        {renderData(destination)}
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }


          </div>
        </div>
      </div>
    </>
  );
};

export default LocationSearch;
