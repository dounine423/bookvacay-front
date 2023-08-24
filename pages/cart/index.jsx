import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Router from "next/router";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer5 from "../../components/footer/footer-5";
import Seo from "../../components/common/Seo";
import Header11 from "../../components/header/header-11";
import SideHotel from "../../components/cart/SideHotel";
import SideActivity from '../../components/cart/sideActivity'
import ActivityProperties from "../../components/activity/activity-list/ActivityProperties";
import { API } from '../../pages/api/api'
import { activityOperation } from "../../features/activity/activity";
import { hotelOperation } from "../../features/hotels/hotelSlice";
import { regionAction } from "../../features/region/region";

const index = () => {
  const dispatch = useDispatch()
  const { LoggedIn } = useSelector(state => state.auth)
  const { hotelReserve, upSellingActivity } = useSelector(state => state.hotel)
  const { activityReserve } = useSelector(state => state.activity)
  const { currency, currencyInfo } = useSelector(state => state.region)
  const [active, setActive] = useState([true, true])
  const [cLoading, setCLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const onBookHandler = () => {
    if (hotelReserve != null)
      changeRateKey()
    else
      Router.push({ pathname: '/booking-page' })
  }

  const onMenuHandler = (index) => {
    let temp = [...active]
    temp[index] = !temp[index]
    setActive([...temp])
  }

  const changeRateKey = async () => {
    getChangedRateKey()
  }

  const decimalAdjust = (type, value, exp) => {
    type = String(type);
    if (!["round", "floor", "ceil"].includes(type)) {
      throw new TypeError(
        "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'.",
      );
    }
    exp = Number(exp);
    value = Number(value);
    if (exp % 1 !== 0 || Number.isNaN(value)) {
      return NaN;
    } else if (exp === 0) {
      return Math[type](value);
    }
    const [magnitude, exponent = 0] = value.toString().split("e");
    const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
    // Shift back
    const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
    return Number(`${newMagnitude}e${+newExponent + exp}`);
  }

  const getChangedRateKey = async () => {
    setLoading(true)
    const { data } = await API.post('/updateAvailability', hotelReserve)
    if (data.success) {
      dispatch(hotelOperation({ type: 'hotelReserve', data: data.result }))
      Router.push({ pathname: '/booking-page' })
    } else {
      toast.error("Something went wrong Please try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
      Router.push({ pathname: '/hotel/hotel-list' })
    }
    setLoading(false)
  }

  const getMainImgFromActivity = (images) => {
    let mainImg = images[0].urls.find((url) => {
      return url.sizeType == "XLARGE";
    })
    return mainImg;
  }

  const getAmountsFromActivity = (amounts) => {
    let adult = null;
    let child = null;
    amounts.map((amount) => {
      if (amount.paxType == "ADULT")
        adult = amount
      if (amount.paxType == "CHILD" && amount.ageFrom > 0)
        child = amount
    })
    let amount = {
      adult,
      child
    }
    return amount
  }

  const viewAllActivity = () => {
    const { inDate, outDate, paxes, adultPaxes, dCode, dName } = hotelReserve
    let aPaxes = adultPaxes.concat(paxes)
    let params = {
      type: 'destination',
      code: dCode,
      checkIn: inDate,
      checkOut: outDate,
      paxes: aPaxes
    }
    let dInfo = {
      code: dCode,
      name: dName,
      countryName: "South Africa"
    }
    dispatch(activityOperation({ type: 'index', data: dInfo }))
    dispatch(activityOperation({ type: 'total_avail', data: upSellingActivity }))
    dispatch(activityOperation({ type: 'pagination', data: 1 }))
    dispatch(activityOperation({ type: 'availability', data: params }))
    dispatch(activityOperation({ type: 'request', data: false }))
    Router.push({ pathname: '/activity/activity-list' })
  }

  const getActivityDetail = async (code) => {
    setCLoading(true)
    const { inDate, outDate, paxes, adultPaxes } = hotelReserve
    let aPaxes = paxes.concat(adultPaxes)
    let params = {
      code,
      from: inDate,
      to: outDate,
      paxes: aPaxes,
      currency
    }
    let availability = {
      code,
      checkIn: inDate,
      checkOut: outDate,
      paxes: aPaxes,

    }
    const { data } = await API.post('/getActivityDetail', params)
    if (data.success) {
      dispatch(activityOperation({ type: 'availability', data: availability }))
      dispatch(activityOperation({ type: 'markUp', data: upSellingActivity.tolerance }))
      dispatch(activityOperation({ type: 'curActivity', data: data.result }))
      dispatch(activityOperation({ type: 'request', data: false }))
      Router.push({ pathname: '/activity/activity-detail/' })
    }
    setCLoading(false)
  }

  const onChangeCurrencyHandler = async (currency) => {
    setCLoading(true)
    const { data } = await API.post('/getCurrentCurrency', currency)
    if (data.success) {
      let currencyInfo = data.result
      dispatch(regionAction({ type: 'currencyInfo', data: currencyInfo }))
      if (hotelReserve) {
        changeHotelReservePrice(currencyInfo, true)
      }
      if (activityReserve.length > 0)
        changeActivityReservePrice(currencyInfo, true)
    } else {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    setCLoading(false)
  }

  const getTotalAmount = () => {
    let total = 0
    if (hotelReserve)
      total += hotelReserve.totalAmount
    if (activityReserve.length > 0)
      total += activityReserve[0].totalAmount
    return decimalAdjust('floor', total, -2)
  }

  const changeHotelReservePrice = (currencyData, flag) => {
    let tempReserve = JSON.parse(JSON.stringify(hotelReserve))
    let totalAmount = 0
    tempReserve.reserveData.map((item) => {
      let price = item.hotelPrice * item.roomCnt * (1 + currencyData.bank_mark_up / 100) * currencyData.client
      item.price = decimalAdjust('floor', price, -2)
      totalAmount += price
    })
    tempReserve.totalAmount = decimalAdjust('floor', totalAmount, -2)
    if (flag) {
      dispatch(hotelOperation({ type: 'hotelReserve', data: tempReserve }))
    } else {
      return totalAmount
    }
  }

  const changeActivityReservePrice = (currencyData, flag) => {
    let tempReserve = JSON.parse(JSON.stringify(activityReserve))
    let totalAmount = 0
    tempReserve[0].modality.map((modality) => {
      modality.rates.map((rate) => {
        rate.amount = rate.billAmount * currencyData.client
        rate.amount = decimalAdjust('floor', rate.amount, -2)
        totalAmount += rate.amount
      })
    })
    totalAmount = decimalAdjust('floor', totalAmount, -2)
    tempReserve[0].totalAmount = totalAmount
    if (flag) {
      dispatch(activityOperation({ type: 'activityReserve', data: tempReserve }))
    } else {
      return totalAmount
    }
  }

  useEffect(() => {
    if (LoggedIn) {
      if (hotelReserve != null) {
        changeHotelReservePrice(currencyInfo, true)
      }
      if (activityReserve.length > 0) {
        changeActivityReservePrice(currencyInfo, true)
      }
    } else {
      Router.push({ pathname: '/login' })
    }
  }, [])

  return (
    <>
      <script async defer src="https://widget.getyourguide.com/dist/pa.umd.production.min.js" data-gyg-partner-id="HN7RKWK"></script>
      <Seo pageTitle="Cart" />
      <div className="header-margin"></div>
      <Header11 currencyHandler={onChangeCurrencyHandler} />
      <ToastContainer />
      <section className={"layout-pt-md layout-pb-lg position-relative" + (cLoading ? " disable" : "")}>
        <div className="absolute" style={{ top: '25%', left: '50%' }}>
          <ClipLoader className="ml-10" loading={cLoading} size={100} color="black" />
        </div>

        <div className="container">
          <div className="d-flex justify-content-end">
            {
              getTotalAmount() > 0 ? (
                <>
                  <div className="text-20 h-60 px-30 py-15 fw-600 text-blue-1">
                    <span className="px-5">Total</span>
                    <span className="px-5">{currency}</span>
                    <span className="px-5">{getTotalAmount()}</span>
                  </div>
                  <div className="w-15  button border-dark-1 -blue-1 py-15 px-30 h-60   rounded-10 bg-white text-green-2 mb-3 mt-10 rounded-8 " onClick={onBookHandler}>
                    <label className="fw-500 text-20" name="type" value="activity">Pay Now</label>
                    <ClipLoader className="ml-10" loading={loading} size={25} color="green" />
                  </div>
                </>
              ) : null
            }
          </div>
          <div className="row ">
            <div className="col-xl-6 col-sm-12" >
              <div className="mainSearch__submit button -blue-1 py-15 px-30 h-60  rounded-4 bg-dark-3 text-white mb-3 justify-content-between mt-10 " onClick={() => onMenuHandler(0)}>
                <label className="fw-500 text-30" name="type" value="activity">Hotel</label>
              </div>
              {
                active[0] && hotelReserve != null ? (<SideHotel hotelData={hotelReserve} />) : null
              }
            </div>
            <div className="col-xl-6 col-xm-12" >
              <div className="mainSearch__submit button -blue-1 py-15 px-30 h-60 rounded-4 bg-dark-3 text-white mb-3 justify-content-between mt-10" onClick={() => onMenuHandler(1)}>
                <label className="fw-500 text-30" name="type" value="activity">Activity</label>
              </div>
              {
                active[1] && activityReserve.length > 0 ? (<SideActivity />) : null
              }
            </div>
          </div>
        </div>
        {
          hotelReserve ? (
            <div className={(cLoading ? " disable" : "")}>
              <div className="bg-blue-1 mt-40 hx-15" />
              <div className="text-center py-30">
                <span className="text-20 fw-500 ">Activities near  {hotelReserve?.name}</span>
                <span className="text-20">, you may be interested in to enhance your experience</span>
              </div>
              <div className="container position-relative">
                <div className="py-30 d-flex justify-between">
                  <span className="text-16 fw-500">{upSellingActivity?.total} activities near  {hotelReserve?.name}</span>
                  {
                    upSellingActivity?.total > 0 ? (
                      <a onClick={viewAllActivity} className="text-16 d-block text-14 text-green-2 fw-500 underline cursor-pointer">View All</a>
                    ) : null
                  }
                </div>
                <div className=" position-absolute" style={{ top: '50px', left: '50%' }}>
                  <ClipLoader loading={cLoading} size={100} />
                </div>
                <div className="row y-gap-30 mb-30">
                  {
                    upSellingActivity?.activities?.map((item, id) => (
                      <ActivityProperties
                        key={id}
                        activity={item}
                        getDetail={getActivityDetail}
                      />
                    ))
                  }
                </div>
              </div>
            </div>

          ) : null
        }
      </section >

      < Footer5 />
    </>
  );
};

export default index;
