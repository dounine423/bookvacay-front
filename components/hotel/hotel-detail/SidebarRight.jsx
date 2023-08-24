import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LocationSearch from '../common/LocationSearch'
import DateSearch from "../common/DateSearch";
import GuestSearch from '../common/GuestSearch';
import { hotelOperation } from '../../../features/hotels/hotelSlice';
import { regionAction } from '../../../features/region/region';

const SidebarRight = () => {
  const dispatch = useDispatch()
  const mySwal = withReactContent(Swal)
  const { availability, defaultFilter, index } = useSelector(state => state.hotel)
  const { facilities } = useSelector(state => state.region)
  const [location, setLocation] = useState(null)
  const [inDate, setInDate] = useState(null)
  const [outDate, setOutDate] = useState(null)
  const [guest, setGuest] = useState(null)
  const [paxes, setPaxes] = useState([])
  const [adults, setAdults] = useState([])

  const onSearchHandler = () => {
    if (location == "") {
      showError('Location must be selected')
      return
    }
    if (inDate == "" || outDate == "") {
      showError('CheckIn and CheckOut Dates must be selected')
      return
    }
    if (datediff(Date.now(), inDate) < -1) {
      showError('CheckIn Date is Wrong')
      return
    }
    let request = {
      code: location.code,
      type: location.type,
      inDate,
      outDate,
      location,
      adults: guest.Adults,
      children: guest.Children,
      rooms: guest.Rooms,
      paxes,
      adultPaxes: adults
    }

    if (facilities) {
      let temp = JSON.parse(JSON.stringify(facilities))
      temp.map((group) => {
        group.data.map((facility) => {
          facility.checked = false
        })
      })
      dispatch(regionAction({ type: 'facilities', data: temp }))
    }
    dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
    dispatch(hotelOperation({ type: 'index', data: location }))
    dispatch(hotelOperation({ type: 'request', data: true }))
    dispatch(hotelOperation({ type: 'availability', data: request }))
    dispatch(hotelOperation({ type: 'filter', data: defaultFilter }));
    Router.push({
      pathname: '/hotel/hotel-list'
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
    const { location, inDate, outDate, adults, children, rooms, paxes, adultPaxes } = availability
    setLocation(index)
    setInDate(inDate)
    setOutDate(outDate)
    setGuest({ Adults: adults, Children: children, Rooms: rooms })
    setPaxes(paxes)
    setAdults(adultPaxes)
  }, [])

  return (
    <div className="px-30 py-30 border-light bg-yellow-3 rounded-4 shadow-4">
      <h3>Search</h3>
      <div className="bg-light-2 " style={{ marginTop: '25px' }}>
        <LocationSearch location={location} getLocation={setLocation} />
      </div>

      <div className="bg-light-2 " style={{ marginTop: '25px' }}>
        <h4 className="text-15 fw-500 ls-2 lh-16 px-20" style={{ paddingTop: '25px' }}>
          CheckIn - CheckOut
        </h4>
        {outDate ? (<DateSearch inDate={inDate} outDate={outDate} getInDate={setInDate} getOutDate={setOutDate} />) : null}
      </div>
      <div className="bg-light-2 " style={{ marginTop: '25px' }}>
        {guest ? (<GuestSearch getAdultAge={setAdults} adultAge={adults} childAge={paxes} getChildAge={setPaxes} guest={guest} getGuest={setGuest} />) : null}
      </div>

      <div style={{ marginTop: '45px' }}>
        <div className="button-item h-full">
          <button className="button -dark-1 px-35 h-60 col-12 bg-blue-1 text-white" onClick={onSearchHandler}>
            <i className='icon-search text-20 mr-10'></i>
            <span className='text-18'> Search</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default SidebarRight;
