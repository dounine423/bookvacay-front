import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Router from "next/router";
import DateSearch from "./DateSearch";
import GuestSearch from "./GuestSearch";
import LocationSearch from "./LocationSearch";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { activityOperation } from "../../../features/activity/activity";

const MainFilterSearchBox = ({ getRequest, setPagination }) => {

  const mySwal = withReactContent(Swal)
  const dispatch = useDispatch()
  const { availability, index } = useSelector(state => state.activity)
  const [location, setLocation] = useState(null)
  const [inDate, setInDate] = useState(null)
  const [outDate, setOutDate] = useState(null)
  const [guest, setGuest] = useState(null)

  const onSearchBtnHandler = () => {
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

    let request = {
      type: 'destination',
      code: location.code,
      checkIn: inDate,
      checkOut: outDate,
      paxes: guest,
    }
    dispatch(activityOperation({ type: 'activityReserve', data: [] }))
    dispatch(activityOperation({ type: 'pagination', data: 1 }))
    dispatch(activityOperation({ type: 'availability', data: request }))
    dispatch(activityOperation({ type: 'index', data: location }))
    dispatch(activityOperation({ type: 'request', data: true }))
    if (setPagination)
      setPagination(1)
    if (getRequest)
      getRequest(true)
    if (getRequest == null)
      Router.push({
        pathname: '/activity/activity-list',
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

  const getDate = (date, day = 0) => {
    return moment(date).add(day, 'day').format('YYYY-MM-DD')
  }

  useEffect(() => {
    if (availability != null) {
      const { checkIn, checkOut, paxes } = availability
      setLocation(index)
      setInDate(checkIn)
      setOutDate(checkOut)
      setGuest(paxes)
    } else {
      let temp = [{ age: 30 }, { age: 30 }]
      setGuest([...temp])
      setInDate(getDate(Date.now()))
      setOutDate(getDate(Date.now(), 7))
    }
  }, [])

  return (
    <>
      <div
        className="mainSearch -w-900 w-100 bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded-100 mt-40 is-in-view"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="button-grid items-center">
          <LocationSearch getLocation={setLocation} location={location} />
          {/* End Location */}

          <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
            <div>
              <h4 className="text-15 fw-500 ls-2 lh-16">
                Check in - Check out
              </h4>
              {outDate ? (<DateSearch inDate={inDate} outDate={outDate} getInDate={setInDate} getOutDate={setOutDate} />) : null}
            </div>
          </div>
          {/* End check-in-out */}

          {guest ? (<GuestSearch paxes={guest} getGuest={setGuest} />) : null}
          {/* End guest */}

          <div className="button-item">
            <button
              className="mainSearch__submit button -dark-1 h-60 px-35 col-12 rounded-100 bg-blue-1 text-white"
              onClick={onSearchBtnHandler}
            >
              <i className="icon-search text-20 mr-10" />
              Search
            </button>
          </div>
          {/* End search button_item */}
        </div>
      </div>
      {/* End .mainSearch */}
    </>
  );
};

export default MainFilterSearchBox;
