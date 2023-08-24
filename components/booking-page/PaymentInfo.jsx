import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import Swal from 'sweetalert2';
import Router from "next/router";
import withReactContent from 'sweetalert2-react-content';
import BookingDetails from "./sidebar/HotelBookingDetails"
import ActivityBookingDetail from './sidebar/ActivityBookingDetail'
import RatingInfo from "./RatingInfo";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API } from '../../pages/api/api'
import { activityOperation } from '../../features/activity/activity'
import { hotelOperation } from "../../features/hotels/hotelSlice";
import axios from "axios";
import crypto from 'crypto'

const PaymentInfo = ({ prevFunction }) => {
  const dispatch = useDispatch()
  const mySwal = withReactContent(Swal)
  const { currency, currencyInfo } = useSelector(state => state.region)
  const { hotelReserve } = useSelector(state => state.hotel)
  const { holder_info } = useSelector(state => state.holder)
  const { activityReserve } = useSelector(state => state.activity)
  const { userInfo } = useSelector(state => state.auth)

  const [loading, setLoading] = useState(false)

  const calculatePortalAmount = () => {
    const { bank_mark_up, portal } = currencyInfo
    let total = 0
    if (hotelReserve) {
      hotelReserve.reserveData.map((item) => {
        let price = item.hotelPrice * item.roomCnt * (1 + bank_mark_up / 100) * portal / item.rooms
        total += price
      })
    }
    if (activityReserve.length > 0) {
      activityReserve[0].modality.map((modality) => {
        modality.rates.map((rate) => {
          let price = rate.billAmount * portal
          total += price
        })
      })
    }
    return decimalAdjust('floor', total, -2)
  }

  const payNow = async () => {
    setLoading(true)
    const { email } = holder_info
    let total = calculatePortalAmount()
    const myData = {
      merchant_id: "13307418",
      merchant_key: "2k6snwb8basud",
      email_address: email,
      m_payment_id: "00001",
      pf_payment_id: "",
      amount: total,
      item_name: "For payment for bookvacay.online",
    };
    myData["signature"] = generateSignature(myData);
    const pfParamString = dataToString(myData);
    const identifier = await generatePaymentIdentifier(pfParamString);
    if (identifier != null) {
      payfast_do_onsite_payment({ "uuid": identifier }, (result) => {
        if (result == true) {
          let bookingData = makeBookingData(identifier)
          bookingHandler(bookingData)
        } else {
          setLoading(false)
        }
      })
    }
  }

  const bookingHandler = async (params) => {
    const { data } = await API.post('/bookingAllByUser', params)
    if (data.success) {
      const { hotel, activity } = data.result
      if (hotel) {
        if (hotel.success) {
          dispatch(hotelOperation({ type: 'hotelBook', data: hotel.data }))
          toast.success("Hotel booking is success", {
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
        else
          toast.error("Hotel " + hotel.error, {
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
      if (activity && activity.success) {
        if (activity.success) {
          toast.success("Activity booking is success", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          dispatch(activityOperation({ type: 'activityBook', data: activity.data }))
        }
        else
          toast.error("Activity " + activity.error, {
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
      setTimeout(() => {
        Router.push({ pathname: '/checkout' })
        dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
        dispatch(activityOperation({ type: 'activityReserve', data: [] }))
      }, 5000)
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
    setLoading(false)
  }

  const makeBookingData = (uuid) => {
    const { name, surname, email, phone, mail, mailUpdate, zipCode, address, country } = holder_info
    const { client, portal, update, bank_mark_up } = currencyInfo
    let allBookData = {}
    let paymentData = {
      uuid,
      clientCurrency: currency,
      client,
      portal,
      update
    }
    if (hotelReserve) {
      const { reserveData, totalAmount } = hotelReserve
      let rooms = []
      reserveData.map((item) => {
        const { rateKey, paxInfo } = item
        rooms.push({
          rateKey,
          paxes: paxInfo
        })
      })
      let pureAmount = getHotelTotalAmount(reserveData)
      paymentData['totalAmount'] = pureAmount
      let bookData = {
        holder: {
          id: userInfo?.id,
          name,
          surname,
          email,
          phone
        },
        rooms,
        bookInfo: hotelReserve,
        payment: paymentData
      }
      allBookData['hotel'] = bookData
    }
    if (activityReserve.length > 0) {
      let telephones = []
      let activities = []
      telephones.push(phone)
      let holder = {
        id: userInfo?.id,
        name,
        surname,
        email,
        address,
        zipCode,
        mailing: mail,
        country,
        mailUpdDate: mailUpdate,
        telephones
      }
      activityReserve.map((activity) => {
        activity.modality.map((modality) => {
          modality.rates.map((rate) => {
            let activity = {
              preferedLanguage: "en",
              serviceLanguage: "en",
              rateKey: rate.rateKey,
              from: rate.from,
              to: rate.to,
              paxes: rate.paxes,
              answers: modality?.answers
            }
            activities.push(activity)
          })
        })
      })
      paymentData['totalAmount'] = getActivityTotalAmount(activityReserve[0].modality)
      let params = {
        holder,
        activities,
        payment: paymentData
      }
      allBookData['activity'] = params
    }
    return allBookData
  }

  const getHotelTotalAmount = (rates) => {
    let total = 0
    rates.map((rate) => {
      total += rate.hotelPrice * rate.roomCnt
    })
    return decimalAdjust('floor', total, -2)
  }

  const getActivityTotalAmount = (modalities) => {
    let total = 0
    modalities.map((modality) => {
      modality.rates.map((rate) => {
        total += rate.billAmount
      })
    })
    return decimalAdjust('floor', total, -2)
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

  const generatePaymentIdentifier = async (pfParamString) => {
    const result = await axios.post('https://www.payfast.co.za/onsite/process', pfParamString)
      .then((res) => {
        return res.data.uuid || null;
      })
      .catch((error) => {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
    return result;
  };

  const generateSignature = (data, passPhrase = null) => {
    let pfOutput = "";
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] !== "") {
          pfOutput += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}&`
        }
      }
    }
    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
      getString += `&passphrase=${encodeURIComponent(passPhrase).replace(/%20/g, "+")}`;
    }
    return crypto.createHash("md5").update(getString).digest("hex");
  };

  const dataToString = (dataArray) => {
    let pfParamString = "";
    for (let key in dataArray) {
      if (dataArray.hasOwnProperty(key)) { pfParamString += `${key}=${encodeURIComponent(dataArray[key]).replace(/%20/g, "+")}&`; }
    }
    return pfParamString.slice(0, -1);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payfast.co.za/onsite/engine.js";
    script.async = true;
    document.body.appendChild(script)
  }, [])

  return (
    <div className={"row" + (loading ? " disable" : "")}>
      <div className="col-xl-4 col-lg-4 mt-30">
        {
          hotelReserve != null ? (<BookingDetails hotelData={hotelReserve} />) : null
        }
        <div className="mt-20" />
        {
          activityReserve.length > 0 ? (<ActivityBookingDetail activtyData={activityReserve} />) : null
        }
      </div>
      <div className="col-xl-8 col-lg-8 mt-30 position-relative">
        <ToastContainer />
        <RatingInfo />
        <div className="mt-40">
          <h3 className="text-22 fw-500 mb-20">How do you want to pay?</h3>
          <div className="">
            <label><img src="/img/general/payfast-1.png" onClick={payNow} height={50} width={100} className="rounded-8 cursor-pointer" /></label>
          </div>
        </div>
        <div className="absolute" style={{ top: '25%', left: '50%' }}>
          <ClipLoader loading={loading} size={100} />
        </div>
        <div className="w-full h-1 bg-border mt-40 mb-40" />
        <div className="d-flex justify-end mt-20">
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
