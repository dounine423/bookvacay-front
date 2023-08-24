import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Router from "next/router";
import DateSearch from "./DateSearch";
import GuestSearch from "./GuestSearch";
import LocationSearch from "./LocationSearch";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { hotelOperation } from "../../../features/hotels/hotelSlice";
import { regionAction } from "../../../features/region/region";

const MainFilterSearchBox = ({ setRequest, setFilter, flag, setFacility }) => {
  const dispatch = useDispatch()
  const mySwal = withReactContent(Swal)
  const { defaultFilter, availability, index } = useSelector(state => state.hotel)
  const { facilities } = useSelector(state => state.region)

  const [location, setLocation] = useState(null)
  const [inDate, setInDate] = useState()
  const [outDate, setOutDate] = useState()
  const [guest, setGuest] = useState(null)
  const [child, setChild] = useState([])
  const [adult, setAdult] = useState([])

  const getDate = (date, day = 0) => {
    return moment(date).add(day, 'day').format('YYYY-MM-DD');
  }

  const onHandleSearchBtn = () => {
    if (location == null) {
      showError('Location must be selected')
      return
    }
    if (inDate == null || outDate == null) {
      showError('CheckIn and CheckOut Dates must be selected')
      return
    }
    if (datediff(Date.now(), inDate) < -1) {
      showError('CheckIn Date is Wrong')
      return
    }
    let params = {
      code: location.code,
      type: location.type,
      inDate,
      outDate,
      rooms: guest.Rooms,
      adults: guest.Adults,
      children: guest.Children,
      paxes: child,
      adultPaxes: adult
    }
    if (facilities) {
      let temp = JSON.parse(JSON.stringify(facilities))
      temp.map((group) => {
        group.data.map((facility) => {
          facility.checked = false
        })
      })
      if (setFacility)
        setFacility(temp)
      dispatch(regionAction({ type: 'facilities', data: temp }))
    }
    dispatch(hotelOperation({ type: 'index', data: location }))
    dispatch(hotelOperation({ type: 'request', data: true }))
    dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
    dispatch(hotelOperation({ type: 'availability', data: params }))
    dispatch(hotelOperation({ type: 'filter', data: defaultFilter }))

    if (setRequest)
      setRequest(true)
    if (setFilter)
      setFilter(defaultFilter)
    if (flag)
      Router.push({
        pathname: "/hotel/hotel-list"
      })
  }

  const showError = (string) => {
    mySwal.fire({
      title: <strong>{string}</strong>,
      icon: "error",
      confirmButtonColor: "#3554d1",
      confirmButtonText: "Confirm",
    })
    return
  }

  const datediff = (firstDate, secondDate) => {
    return Math.round((new Date(secondDate) - new Date(firstDate)) / 1000 / 60 / 60 / 24);
  }

  useEffect(() => {
    if (availability != null) {
      const { adults, children, rooms, paxes, inDate, outDate, adultPaxes } = availability
      setLocation(index)
      setGuest({ Adults: adults, Children: children, Rooms: rooms })
      setInDate(inDate)
      setOutDate(outDate)
      setChild([...paxes])
      setAdult([...adultPaxes])
    } else {
      setInDate(getDate(Date.now()));
      setOutDate(getDate(Date.now(), 7));
      setGuest({ Adults: 2, Children: 0, Rooms: 1 })
      setAdult([{ age: 30 }, { age: 30 }])
    }
  }, [])

  return (
    <>
      <div
        className="mainSearch -w-900 bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded-100 mt-40 is-in-view w-100"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="button-grid items-center">
          <LocationSearch getLocation={setLocation} location={location} />
          <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
            <div>
              <h4 className="text-15 fw-500 ls-2 lh-16">
                Check in - Check out
              </h4>
              {outDate ? (<DateSearch inDate={inDate} outDate={outDate} getInDate={setInDate} getOutDate={setOutDate} />) : null}
            </div>
          </div>
          {guest ? (<GuestSearch getAdultAge={setAdult} adultAge={adult} getChildAge={setChild} getGuest={setGuest} guest={guest} childAge={child} />) : null}
          <div className="button-item">
            <button
              className="mainSearch__submit button -dark-1 h-60 px-35 col-12 rounded-100 bg-blue-1 text-white"
              onClick={onHandleSearchBtn}
            >
              <i className="icon-search text-20 mr-10" />
              Search
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default MainFilterSearchBox;
