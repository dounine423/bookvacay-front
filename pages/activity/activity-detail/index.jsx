import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment";
import Router from "next/router";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as Icon from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "photoswipe/dist/photoswipe.css";
import Seo from "../../../components/common/Seo";
import Header11 from "../../../components/header/header-11";
import Footer5 from "../../../components/footer/footer-5";
import Overview from "../../../components/activity/activity-detail/Overview";
import TopBreadCrumb from "../../../components/activity/activity-detail/TopBreadCrumb";
import ImportantInfo from "../../../components/activity/activity-detail/ImportantInfo";
import SlideGallery from "../../../components/activity/activity-detail/SlideGallery";
import { activityOperation } from "../../../features/activity/activity";
import { regionAction } from "../../../features/region/region";
import { API } from "../../api/api";

const TourSingleV1Dynamic = () => {
  const dispatch = useDispatch()
  const mySwal = withReactContent(Swal)
  const { currency } = useSelector(state => state.region)
  const { LoggedIn } = useSelector(state => state.auth)

  if (LoggedIn == false) {
    Router.push({ pathname: '/login' })
  }

  const { curActivity, availability, activityReserve } = useSelector(state => state.activity)

  const [price, setPrice] = useState(0)
  const [cart, setCart] = useState([])
  const [activity, setActivity] = useState(null)

  const getMainImgFromActivity = (images) => {
    let mainImg = images[0].urls.find((url) => {
      return url.sizeType == "XLARGE";
    })
    return mainImg.resource;
  }

  const getDateTime = (date) => {
    return moment(date).format('YYYY-MM-DD');
  }

  const getChoice = (rate, cPolicy) => {
    const { languages, sessions } = rate
    return (
      <div>
        {
          cPolicy ? (
            <p className="text-green-2 text-15 fw-300">Free Cancellation</p>
          ) : null
        }
        {
          languages?.length > 0 ? (<h6 className="mt-5">Language</h6>) : null
        }

        <ul className="mt-10">
          {
            languages?.map((lang, langId) => (
              <li key={"lang" + langId} className="text-black fw-300 text-14 ml-20" style={{ listStyle: "disc" }}>{lang.description}</li>
            ))
          }
        </ul>
        {
          sessions?.length > 0 ? (<h6 className="mt-5">Session</h6>) : null
        }

        <ul className="mt-10">
          {
            sessions?.map((session, sessionId) => (
              <li key={"session" + sessionId} className="fw-300 text-black text-14 ml-20" style={{ listStyle: 'disc' }}>{session.name}</li>
            ))
          }
        </ul>
      </div>)
  }

  const getAmount = (rate) => {
    const { totalAmount, paxAmounts } = rate
    return (
      <div>
        <div className="mt-10" />
        <p className="text-black text-14 fw-600">Total {currency} {totalAmount?.c_amount}</p>
        <ul className="mt-10">
          {
            paxAmounts.map((pax, paxId) => (
              <li key={paxId} className="text-14 fw-300 text-black d-flex justify-between">
                <span>{convertStr(pax.paxType)}</span>
                <span>{currency + " " + pax.c_amount}</span>
                <span>Age {pax.ageFrom} - {
                  pax.ageTo > 100 ? (
                    <FontAwesomeIcon icon={Icon.faInfinity} size="sm" color="black" style={{ marginRight: '3px' }} />
                  ) : (< span > {pax.ageTo}</span>)
                }</span>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }

  const convertStr = (str) => {
    let first = str[0]
    let rest = str.slice(1, str.length)
    rest = rest.toLowerCase()
    return first + rest
  }

  const getModality = (modality) => {
    const { name, questions, amountsFrom, comments } = modality

    // let contract = comments[0].text.split('//')
    return (
      <>
        <p className="text-blue-1 text-18 fw-500">{name}</p>
        <ul className="mt-10">
          {
            amountsFrom?.map((amount, amountId) => (
              <li key={amountId} className="fw-300 text-14 text-black d-flex justify-between">
                <span>{convertStr(amount.paxType)}</span>
                <span>{currency + " " + amount.c_amount}</span>
                <span>Age {amount.ageFrom} - {
                  amount.ageTo > 100 ? (
                    <FontAwesomeIcon icon={Icon.faInfinity} size="sm" color="black" style={{ marginRight: '3px' }} />
                  ) : (< span > {amount.ageTo}</span>)
                }</span>

              </li>
            ))
          }
        </ul >
        <ul className="mt-10">
          <p className="text-black text-16 fw-500">Contract Remark</p>
          {
            comments[0]?.text?.split('//')?.map((item, id) => (
              item.trim().length > 0 ? (
                <li key={id} className=" text-14 text-black ml-20" style={{ listStyleType: 'disc' }}  >
                  <span>{item}</span>
                </li>
              ) : null
            ))
          }

        </ul>
        {
          questions?.length > 0 ? (
            <ul className="mt-10">
              <p className="text-black text-16 fw-500">Questions</p>
              {
                questions?.map((question, qId) => (
                  <li key={qId} className="text-black ml-20" style={{ listStyleType: 'disc' }}>{question.text}</li>
                ))
              }
            </ul >
          ) : null
        }
      </>
    )
  }

  const activitySelect = (mId, rateId, e) => {
    const { modalities } = curActivity.data
    let dateIndex = e.target.selectedIndex
    let tempCart = [...cart]
    let { questions, code, name } = modalities[mId]
    let rate = modalities[mId].rates[0].rateDetails[rateId]
    let { paxes } = availability
    const { rateKey, languages, sessions, totalAmount, paxAmounts, operationDates } = rate
    let amount = totalAmount.c_amount
    let b_amount = totalAmount.b_amount
    if (dateIndex > 0) {
      const { from, to, cancellationPolicies } = operationDates[dateIndex - 1]
      let curRate = {
        rateKey,
        from,
        to,
        paxAmounts,
        cPolicy: cancellationPolicies[0],
        languages,
        sessions,
        amount,
        paxes,
        billAmount: b_amount
      }
      let mFlag = checkDuplication(tempCart, code, 'code')
      if (typeof mFlag == 'boolean') {
        let tempRates = []
        tempRates.push(curRate)
        let tempM = {
          code,
          name,
          questions,
          rates: tempRates
        }
        tempCart.push(tempM)
      } else {
        let rFlag = checkDuplication(tempCart[mFlag].rates, rateKey, 'rateKey')
        if (typeof rFlag == 'boolean') {
          tempCart[mFlag].rates.push(curRate)
        } else {
          tempCart[mFlag].rates[rFlag] = curRate
        }
      }
    } else {
      if (tempCart.length > 0) {
        let rFlag = checkDuplication(tempCart[mId].rates, rateKey, 'rateKey')
        if (typeof rFlag == 'number') {
          tempCart[mId].rates.splice(rFlag, 1)
        }
        if (tempCart[mId].rates.length == 0) {
          tempCart.splice(mId, 1)
        }
      }
    }
    let total = getTotalAmount(tempCart)
    setPrice(total)
    setCart([...tempCart])
  }

  const getTotalAmount = (list) => {
    let total = 0
    list.map((item) => {
      item.rates.map((item) => {
        total += item.amount
      })
    })
    return decimalAdjust('floor', total, -2)
  }

  const checkDuplication = (list, code, type) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i][type] == code)
        return i
    }
    return false
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

  const addToCart = () => {
    const { code, name, country, content } = curActivity.data
    if (cart.length == 0) {
      mySwal.fire('Select one or more options you want to book', '', 'error')
      return;
    }
    const { checkIn, checkOut } = availability
    let tempList = []
    let activityData = {
      code,
      name,
      currency,
      from: checkIn,
      to: checkOut,
      image: getMainImgFromActivity(content.media.images),
      location: (country.destinations[0].name + " , " + country.name),
      totalAmount: price,
      modality: cart,
      bookMarkUp: curActivity.bookMarkUp
    }
    // if (activityFlag != null) {
    //   tempList[flag] = activityData
    // } else {

    // }
    tempList.push(activityData)
    dispatch(activityOperation({ type: 'activityReserve', data: tempList }))
    setTimeout(() => {
      dispatch(activityOperation({ type: 'activityReserve', data: [] }))
    }, 1200000)
    mySwal.fire('Add Card', 'Activity has been added to your card', 'success').then(() => {
      Router.push({ pathname: '/activity/activity-list' });
    })
  }

  const removeModality = (id) => {
    let temp = [...cart]
    temp.splice(id, 1)
    let price = getTotalAmount(temp)
    setCart([...temp])
    setPrice(price)
  }

  const onChangeCurrencyHandler = async (currency) => {
    const { data } = await API.post('/getCurrentCurrency', currency)
    if (data.success) {
      let c_h_rate = data.result.client
      dispatch(regionAction({ type: 'currencyInfo', data: data.result }))
      let tempModality = JSON.parse(JSON.stringify(activity.modalities))
      tempModality.map((modality) => {
        modality.amountsFrom.map((amount) => {
          amount.c_amount = decimalAdjust('floor', amount.b_amount * c_h_rate, -2)
        })
        modality.rates[0].rateDetails.map((rate) => {
          rate.totalAmount.c_amount = decimalAdjust('floor', rate.totalAmount.b_amount * c_h_rate, -2)
          rate.paxAmounts.map((pax) => {
            pax.c_amount = decimalAdjust('floor', pax.b_amount * c_h_rate, -2)
          })
        })
        modality.rates[0].rateDetails
      })
      setActivity({ ...activity, modalities: tempModality })
    }
  }

  useEffect(() => {
    if (curActivity)
      setActivity(curActivity.data)
  }, [curActivity])

  return (
    <>
      {
        activity ? (
          <div>
            <Seo pageTitle={activity.name} />
            <div className="header-margin"></div>
            <Header11 currencyHandler={onChangeCurrencyHandler} />
            <TopBreadCrumb type="Activities" destination={activity.country.destinations[0].name} activity={activity.name} />
            {
              activity.content?.media?.images ? (
                <section className="pt-40">
                  <div className="container">
                    <SlideGallery activityImgs={activity.content?.media?.images} />
                  </div>
                </section>
              ) : null
            }
            <section className="pt-40 js-pin-container">
              <div className="container">
                <div className="row y-gap-30">
                  <div className="col-xl-12">
                    <div className="row y-gap-20 justify-between items-end">
                      <div className="col-auto">
                        <h1 className="text-26 fw-600">{activity.name}</h1>
                        <div className="row x-gap-10 y-gap-20 items-center pt-10">
                          <div className="col-auto">
                            <div className="row x-gap-10 items-center">
                              <div className="col-auto">
                                <div className="d-flex x-gap-5 items-center">
                                  <i className="icon-location-2 text-16 text-light-1"></i>
                                  <div className="text-15 text-light-1">
                                    {activity.country.destinations[0].name + " , " + activity.country.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-22 fw-500 mt-40">Operation Days</h3>
                    <div className="d-flex mt-2 mb-3">
                      {
                        activity.operationDays?.map((day, dayId) => (
                          <div key={dayId} className="bg-blue-1 px-2 py-1 text-white rounded-8 mr-5">
                            {day.name}
                          </div>
                        ))
                      }
                    </div>
                    <div className="border-top-light mt-40 mb-40"></div>
                    <Overview description={activity.content?.description} />
                  </div>
                </div>
              </div>
            </section>
            <section className="pt-40 mb-50  ">
              <div className="container">
                <div className="col-lg-12 row d-flex">
                  <table className="col-lg-9 border-blue ">
                    <thead className="bg-light-2" >
                      <tr className="bg-blue-1 border-blue text-white">
                        <th className="text-left border-blue"><p className="ml-10 text-white">Modality Name</p> </th>
                        <th className="text-left border-blue"><p className="ml-10 text-white">Operation Date</p> </th>
                        <th className="text-left border-blue"><p className="ml-10 text-white">Your Choice </p></th>
                        <th className="text-lef border-bluet"><p className="px-10 text-white">Amount</p></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        activity.modalities.map((modality, mId) => (
                          <Fragment key={mId}>
                            <tr key={mId} className="border-blue" >
                              <td rowSpan={modality.rates[0].rateDetails.length + 1} className="border-blue v-top col-6 px-10 py-10 ">
                                {getModality(modality)}
                              </td>
                            </tr>
                            {
                              modality.rates[0].rateDetails.map((rate, rateId) => (
                                <tr key={"rate" + rateId + mId} className="border-blue" >
                                  <td className="border-blue v-top col-2   px-10 ">
                                    <select onChange={(e) => activitySelect(mId, rateId, e)} className="form-control mt-10" >
                                      <option>None</option>
                                      {
                                        rate.operationDates.map((date, oId) => (
                                          <option key={"operation" + oId} index={oId}>{getDateTime(date.from) + " - "} {getDateTime(date.from)}</option>
                                        ))
                                      }
                                    </select>
                                  </td>
                                  <td className="col-1 border-blue v-top px-10 ">
                                    <div className="mt-10" />
                                    {getChoice(rate, modality.rates[0].freeCancellation)}
                                  </td>
                                  <td className="col-3 border-blue v-top px-10 ">
                                    {getAmount(rate)}
                                  </td>
                                </tr>
                              ))
                            }
                          </Fragment>
                        ))
                      }

                    </tbody>
                  </table>
                  <div className="col-lg-3">
                    <div className="bg-blue-1 " style={{ width: "auto", height: '33px' }} />
                    {
                      price > 0 ? (
                        <label className="text-black text-18 fw-600 mt-20">Total :  {currency + " " + price}</label>
                      ) : null
                    }
                    <button onClick={addToCart} className=" button h-50 px-2 w-100  -dark-1 bg-blue-1 text-white mt-20  mb-2  ">
                      <div>Add to Cart</div>
                    </button>
                    {
                      cart.map((modality, mId) => (
                        <div key={mId} className="px-10 py-10 mb-10 bg-blue-2 rounded-8 ">
                          <div className="text-18 fw-500">{modality.name}</div>
                          {
                            modality?.rates?.map((rate, rateId) => (
                              <div key={rateId} className="position-relative border rounded-16 mb-10 px-10 py-10">
                                <div className="d-flex justify-between fw-500 ">
                                  <span>From {getDateTime(rate.from)}</span>
                                  <span>To {getDateTime(rate.to)}</span>
                                </div>
                                <div className="row justify-between fw-500 ">
                                  <div className="col-5">
                                    {rate?.languages?.length > 0 ? (
                                      <p className="text-black">Languages</p>
                                    ) : null}
                                  </div>
                                  <div className="col-7">
                                    <ul>
                                      {
                                        rate?.languages?.map((item, id) => (
                                          <li key={id}>{item.description}</li>
                                        ))
                                      }
                                    </ul>

                                  </div>
                                </div>
                                <div className="row justify-between fw-500 ">
                                  <div className="col-5">
                                    {rate?.sessions?.length > 0 ? (
                                      <p className="text-black">Sessions</p>
                                    ) : null}
                                  </div>
                                  <div className="col-7">
                                    <ul>
                                      {
                                        rate?.sessions?.map((item, id) => (
                                          <li key={id}>{item.code}</li>
                                        ))
                                      }
                                    </ul>

                                  </div>
                                </div>
                                <div className="row justify-between">
                                  <p className="text-black fw-500 mt-10 px-10">{currency + " " + rate.amount}</p>
                                </div>
                                {/* <div onClick={() => removeModality(rateId)} className="mb-5 position-absolute" style={{ top: '3px', right: '10px' }}>
                            <i className="icon-close text-10 cursor-pointer " color="red" />
                          </div> */}
                              </div>
                            ))
                          }
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </section >

            <section className="pt-40 mb-50">
              <div className="container">
                <div className="pt-40 border-top-light">
                  <div className="row x-gap-40 y-gap-40">
                    <div className="col-auto">
                      <h3 className="text-22 fw-500">Important information</h3>
                    </div>
                  </div>
                  <ImportantInfo content={activity.content} />
                </div>
              </div>
            </section>
            <Footer5 />
          </div>
        ) : null
      }
    </>
  );
};

export default dynamic(() => Promise.resolve(TourSingleV1Dynamic), {
  ssr: false,
});
