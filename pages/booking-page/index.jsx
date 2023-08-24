import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Router from "next/router";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Seo from "../../components/common/Seo";
import Header11 from "../../components/header/header-11";
import Footer5 from "../../components/footer/footer-5";
import StepperBooking from "../../components/booking-page/stepper-booking";
import { API } from "../api/api";
import { hotelOperation } from "../../features/hotels/hotelSlice";
import { regionAction } from "../../features/region/region";

const index = () => {
  const dispatch = useDispatch()
  const [cLoading, setCLoading] = useState(false)
  const { LoggedIn } = useSelector(state => state.auth)
  const { hotelReserve } = useSelector(state => state.hotel)

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

  const onChangeCurrencyHandler = async (currency) => {
    setCLoading(true)
    const { data } = await API.post('/getCurrentCurrency', currency)
    let tempReserve = JSON.parse(JSON.stringify(hotelReserve))
    if (data.success) {
      let currencyInfo = data.result
      let totalAmount = 0
      tempReserve.reserveData.map((item) => {
        let price = item.hotelPrice * item.roomCnt * (1 + currencyInfo.bank_mark_up / 100) * currencyInfo.client
        item.price = decimalAdjust('floor', price, -2)
        totalAmount += price
      })
      tempReserve.totalAmount = decimalAdjust('floor', totalAmount, -2)
      dispatch(regionAction({ type: 'currencyInfo', data: currencyInfo }))
      dispatch(hotelOperation({ type: 'hotelReserve', data: tempReserve }))
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

  useEffect(() => {
    if (LoggedIn == false) {
      Router.push({ pathname: '/login' })
    }
  }, [LoggedIn])

  return (
    <>
      <Seo pageTitle="Hotel Booking Page" />
      <div className="header-margin"></div>
      <Header11 />
      <ToastContainer />
      <section className={"pt-40 layout-pb-md " + (cLoading ? " disable" : "")}>
        <div className="container position-relative">
          <div className="absolute" style={{ top: '25%', left: '50%' }}>
            <ClipLoader loading={cLoading} size={100} color="black" />
          </div>
          <StepperBooking />
        </div>
      </section>

      <Footer5 />
    </>
  );
};

export default index;
