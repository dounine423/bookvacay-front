import Image from "next/image";
import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import moment from "moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { hotelOperation } from "../../../features/hotels/hotelSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icon from '@fortawesome/free-solid-svg-icons'
import { API } from '../../../pages/api/api'

const AvailableRooms = ({ roomData, contentId, availId }) => {

  const dispatch = useDispatch();
  const myswal = withReactContent(Swal);
  const { imageUrl, total_content, total_avail, availability } = useSelector(state => state.hotel)
  const { currency } = useSelector(state => state.region)
  const [avail_data, setAvailData] = useState(null)
  const [hotel_content, setHotelContent] = useState(null)
  const [rooms, setRooms] = useState(null)
  const [reserveData, setReserve] = useState([])

  useEffect(() => {
    // console.log("roomData", roomData)
    setAvailData(total_avail?.hotels[availId])
    setHotelContent(total_content[contentId])
    setRooms(availability?.rooms)
  }, [])

  const getMainImageFromHotel = (images) => {
    let image = images.find((item) => {
      return item.imageTypeCode == "GEN"
    })
    return imageUrl + image.path;
  }

  const getReviewWord = (score) => {
    if (1 <= score && score < 3.5) {
      return "Review Score"
    }
    if (3.5 <= score && score < 4) {
      return "Good"
    }
    if (4 <= score && score <= 4.25) {
      return "Very Good"
    }
    if (4.25 < score && score < 4.5) {
      return "Fabulous"
    }
    if (4.5 <= score && score <= 5) {
      return "Exceptional"
    }
  }

  const convertUp2Lower = (str) => {
    let first = str[0]
    let rest = str.slice(1, str.length)
    rest = rest.toLowerCase()
    return first + rest
  }

  const getPhones = (phones) => {
    let result = []
    phones.map((item) => {
      let temp = {
        ...item,
        phoneType: convertUp2Lower(item.phoneType)
      }
      result.push(temp)
    })
    return result
  }

  const onRoomReserve = () => {
    const { code, accommodation, name, address, city, images, category, phones, facilities } = hotel_content
    const { destinationCode, destinationName, currency } = avail_data
    const { inDate, outDate, adults, children, paxes, rooms, adultPaxes } = availability
    const { reviews } = avail_data
    if (reserveData.length == 0) {
      myswal.fire('Select one or more options you want to book', '', 'error')
      return;
    }
    let data = {
      code,
      dCode: destinationCode,
      dName: destinationName,
      accommodation,
      name,
      address: address + " " + city,
      image: getMainImageFromHotel(images),
      category,
      currency,
      rate: reviews[0].rate,
      reviewCnt: reviews[0].reviewCount,
      reviewWord: getReviewWord(reviews[0].rate),
      inDate,
      outDate,
      adults,
      children,
      paxes,
      rooms,
      phones: getPhones(phones),
      adultPaxes,
      extra: getExtraCost(facilities),
      totalAmount: getTotalAmount(),
      reserveData
    }
    dispatch(hotelOperation({ type: 'hotelReserve', data }))
    getActivityNearHotel()
    myswal.fire('Add Card', 'Hotel has been added to your card. Please complete your booking within 20 minutes', 'success').then(() => {
      setTimeout(() => {
        dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
      }, 1200000)
      Router.push({ pathname: '/hotel/hotel-list' });
    })
  }

  const getExtraCost = (facilities) => {
    let result = []
    facilities.slice(1).map((group) => {
      group.data.map((item) => {
        if (item.indFee)
          result.push(item)
      })
    })
    return result
  }

  const onRoomSelect = (cnt, roomId, roomRate, roomName, roomCode, roomFacilities) => {
    const { rateKey, clientPrice } = roomRate
    let totalPrice = decimalAdjust('floor', clientPrice / rooms, -2)
    let temp = [...reserveData]
    let roomCnt = parseOption(cnt)
    let flag = null
    let flagIndex = null
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].rateKey == rateKey) {
        flag = temp[i]
        flagIndex = i
      }
    }
    if (flag) {
      if (roomCnt == 0) {
        temp.splice(flagIndex, 1)
      } else {
        let updateItem = {
          ...flag,
          roomCnt,
          price: totalPrice,
        }
        temp[flagIndex] = updateItem
      }
    } else {
      let facility = [...hotel_content.facilities.slice(-1)[0].data]
      roomFacilities?.map((item) => {
        facility.push(item)
      })
      let newItem = {
        roomCnt,
        price: totalPrice,
        ...roomRate,
        roomName,
        roomCode,
        facility
      }
      temp.push(newItem)
    }
    setReserve([...temp])
  }

  const parseOption = (str) => {
    let temp = str.split(/[( )]/g)
    return parseInt(temp[0])
  }

  const getTotalAmount = () => {
    let total = 0
    reserveData.map((item) => {
      total += item.roomCnt * item.price
    })
    return total;
  }

  const getTotalRoomCnt = () => {
    let total = 0
    reserveData.map((item) => {
      total += +item.roomCnt
    })
    return total
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

  const datediff = (firstDate, secondDate) => {
    return Math.round((new Date(secondDate) - new Date(firstDate)) / 1000 / 60 / 60 / 24);
  }

  const getDateTime = (date) => {
    return moment(date).format('MMM D Y');
  }

  const getChoice = (roomRate) => {
    let renderData = []
    const { promotions, boardName, cancellationPolicies, packaging, boardCode, rateClass } = roomRate
    let board = boardName
    if (boardCode == 'HB')
      board = 'Breakfast & dinner included'
    if (boardCode == 'FB')
      board = 'Breakfast, lunch & dinner included'
    renderData.push(<p key={"board"} className="text-green-2 text-16">{board}</p>)

    if (packaging)
      renderData.push(<p key="packaging" className=" text-16 text-green-2">Product for packaging</p>)
    if (rateClass == "NRF" && promotions == null)
      renderData.push(<p key={"rateClass"} className="text-green-2 text-16">Non Refundable Rate</p>)
    if (cancellationPolicies) {
      renderData.push(<p key="c-policy" className="text-16 text-green-2 fw-100 "><span className="fw-600">Free</span>  Cancellation until {getDateTime(cancellationPolicies[0].from)}  </p>)
    }
    if (promotions) {
      renderData.push(<p key={"promotion"} className="text-black text-16 fw-500">Promotion:</p>)
      promotions.map((item, i) => {
        renderData.push(<p key={i + "promotion"} className=" text-16 text-green-2"> {item.name}</p>)
      })
    }
    return (
      <>
        {renderData}
      </>
    )
  }

  const getPrice = (roomRate) => {
    const { offers, clientTax, clientPrice } = roomRate
    let renderData = []
    renderData.push(<div key={"first"} className="mt-10" />)
    if (offers)
      renderData.push(<p key={"offer"} className="text-16 fw-100 text-red-1 fw-500" style={{ textDecorationLine: 'line-through' }}> {currency + " " + decimalAdjust('floor', (+clientPrice / rooms - +offers[0].amount), -2)} </p>)
    if (clientTax)
      renderData.push(<p key={"tax"} className="text-16 fw-600 text-green-2">Included {currency + " " + decimalAdjust('floor', clientTax / rooms, -2)} taxes</p>)
    renderData.push(<p key={"total"} className="text-20 fw-600 text-black"> {currency + " " + decimalAdjust('floor', clientPrice / rooms, -2)}</p>)
    return (<>
      {renderData}
    </>)
  }

  const getRoomCount = (roomRate) => {
    let allotment = 0
    roomRate.map((item) => {
      allotment = +allotment + +item.allotment
    })
    if (allotment < 6) {
      let renderData = []
      renderData.push(<p key="allotment" className="text-red-1 fw-500 mb-20">Only {allotment} left on our site </p>)
      return (
        <>
          {renderData}
        </>
      )
    }
  }

  const getAllotment = (roomRate, roomId) => {
    const { clientPrice, allotment } = roomRate
    let totalPrice = decimalAdjust('floor', clientPrice / rooms, -2)
    let renderData = []
    for (let i = 1; i <= allotment; i++) {
      renderData.push(<option key={i}>{i} &nbsp;&nbsp;&nbsp;&nbsp; {"(" + currency + " " + decimalAdjust('floor', totalPrice * i, -2) + ")"}</option>)
    }
    return (
      <>
        {renderData}
      </>
    )
  }

  const getSleeps = (count, rate) => {
    let flag = false
    const { rateComment } = rate
    if (count > 5)
      flag = true
    return (
      <div className="mt-10">
        {
          flag ? (
            <div>
              <FontAwesomeIcon icon={Icon.faPerson} size="xl" color="black" style={{ marginRight: '3px' }} />
              <span className="text-16 ml-10 mr-10">*</span>
              <span className="text-16 mr-10">{count}</span>
            </div>
          ) : (
            Array(count).fill().map((_, i) => (
              <FontAwesomeIcon key={i} icon={Icon.faPerson} size="xl" color="black" style={{ marginRight: '3px' }} />
            ))
          )
        }
        {
          rateComment ? (
            <p className="mt-10 text-black fw-500">{rateComment}</p>
          ) : null
        }
      </div>
    )
  }

  const getFacility = (facility) => {
    const { name, number, facilityCode, amount, currency, indFee } = facility
    if (facilityCode == 295 && number != null) {
      return (<>Room size <span className="fw-500">{number} m<sup>2</sup></span> </>)
    }
    else if (facilityCode == 220 && number > 0)
      return (<>{name} <span className="fw-500"> {number} </span></>)
    else if (facilityCode == 298 && number != null)
      return (<>{name} <span className="fw-500"> {number} </span></>)
    else if (indFee)
      return (<> <span className="fw-500">{name} * {amount ? (" ( " + currency + " " + amount + " ) ") : ""}</span>  </>)
    else
      return (<>{name}</>)
  }

  const filterRates = (rates) => {
    let temp = []
    rates.map((rate) => {
      let flag = temp.find((item) => {
        return rate.rateKey == item.rateKey
      })
      if (flag == null)
        temp.push(rate)
    })
    return temp
  }

  const getActivityNearHotel = async () => {
    dispatch(hotelOperation({ type: 'upSellingActivity', data: null }))
    const { inDate, outDate, adultPaxes, paxes } = availability
    const { destinationCode } = avail_data
    let aPaxes = adultPaxes.concat(paxes)
    let params = {
      type: "destination",
      code: destinationCode,
      from: inDate,
      to: outDate,
      paxes: aPaxes,
      limit: 8,
      page: 1,
      currency
    }
    const { data } = await API.post('/getAvailActivities', params)
    if (data.success) {
      dispatch(hotelOperation({ type: 'upSellingActivity', data: data.result }))
    } else {
      let result = {
        total: 0,
        activities: []
      }
      dispatch(hotelOperation({ type: 'upSellingActivity', data: result }))
    }
  }

  return (
    <>
      {
        hotel_content ? (
          <div className="border-light rounded-4 px-30 py-30 sm:px-20 sm:py-20" >
            <div className="row y-gap-20" style={{ overflowX: 'auto' }}>
              <div className="col-12">
                <div className="roomGrid">
                  <div className="row">
                    <div className="col-xl-12 col-sm-12 d-flex">
                      <table className="col-lg-10 border-blue">
                        <thead className="bg-light-2" >
                          <tr className="bg-blue-1 text-white border-blue">
                            <th className="text-left border-blue"><p className="ml-10 text-white">Room Type</p> </th>
                            <th className="text-left border-blue"><p className="ml-10 text-white">Sleeps</p> </th>
                            <th className="text-left border-blue"><p className="ml-10 text-white">Price for {datediff(availability?.inDate, availability?.outDate)} {datediff(availability?.inDate, availability?.outDate) < 2 ? "night" : "nights"} </p></th>
                            <th className="text-left border-blue"><p className="ml-10 text-white">Your Choice</p> </th>
                            <th className="text-left border-blue"><p className="px-10 text-white">Select Room</p></th>
                          </tr>
                        </thead>
                        <tbody style={{ borderWidth: '1px' }}>
                          {
                            roomData.map((room, roomId) => (
                              < Fragment key={roomId}>
                                <tr id={roomId} key={roomId} className="border-blue">
                                  <td rowSpan={filterRates(room.rates).length + 1} className="col-4 px-10 py-10 border-blue v-top">
                                    <h3 className="text-18 fw-500 mt-15 text-blue-1 mt-10 mb-10">{room.name}</h3>
                                    {
                                      getRoomCount(room.rates)
                                    }
                                    {
                                      room.roomImgs.length != 0 ? (
                                        <Image
                                          width={600}
                                          height={450}
                                          src={imageUrl + room.roomImgs[0].path}
                                          alt="image"
                                        />
                                      ) : null
                                    }
                                    <div className="mt-15">
                                      {
                                        room.roomStays?.map((stay, stayId) => (
                                          <div className="text-16 mt-5" key={stayId}>
                                            <span>{stay.number}</span>
                                            <span> * </span>
                                            <span>{stay.content}</span>
                                            <img src={"/img/bed/" + stay.img + ".png"} height={25} width={25} style={{ marginTop: '-2px' }} className="ml-10" />
                                          </div>
                                        ))
                                      }
                                    </div>
                                    <div className="mt-15">
                                      {
                                        room.roomFacilities?.map((facility, facId) => (
                                          <span key={facId} className="mr-5" style={{ display: 'inline-block' }}>
                                            <i className="icon-check text-10 mr-5" style={{ color: "green" }} />
                                            <span className="ml-4 text-12">{getFacility(facility)}</span>
                                          </span>
                                        ))
                                      }
                                    </div>
                                    <div>
                                      {
                                        hotel_content?.facilities?.slice(-1)[0].data.map((facility, fId) => (
                                          <span key={fId} className="mr-5" style={{ display: 'inline-block' }}>
                                            <i className="icon-check text-10 mr-5" style={{ color: "green" }} />
                                            <span className="ml-4 text-12">{getFacility(facility)}</span>
                                          </span>
                                        ))
                                      }
                                    </div>
                                  </td>
                                </tr>
                                {
                                  filterRates(room.rates).map((roomRate, rateId) => (
                                    <tr id={"rate" + rateId + roomId} key={"rate" + rateId + roomId} className="border-blue">
                                      <td className="border-blue v-top col-lg-3 px-10 ">
                                        {getSleeps(room.maxPax, roomRate)}
                                      </td>
                                      <td className="border-blue v-top col-lg-2 px-10 ">
                                        {getPrice(roomRate)}
                                      </td>
                                      <td className="border-blue v-top col-lg-3 px-10 py-10 ">
                                        {getChoice(roomRate)}
                                      </td>
                                      <td className="border-blue v-top col-lg-2 px-10 ">
                                        <select className="form-control mt-10" onChange={(e) => onRoomSelect(e.target.value, roomId, roomRate, room.name, room.code, room.roomFacilities)}>
                                          <option key="0">0</option>
                                          {
                                            getAllotment(roomRate, roomId)
                                          }
                                        </select>
                                      </td>
                                    </tr>
                                  ))
                                }
                              </Fragment>
                            ))
                          }
                        </tbody>
                      </table>
                      <div className="col-lg-2 ">
                        <div className="bg-blue-1 " style={{ width: "auto", height: '63.2px' }} />
                        <div className="px-10">
                          {
                            getTotalRoomCnt() != 0 ? (
                              <div className="text-18 mt-10 fw-300">
                                {getTotalRoomCnt()} {getTotalRoomCnt() == 1 ? "room" : "rooms"}  for
                                <div className="fw-500 text-22">
                                  {currency} {decimalAdjust('floor', getTotalAmount(), -2)}
                                </div>
                              </div>) : null
                          }
                          <button onClick={() => onRoomReserve()} className=" button h-50 px-2 w-100  -dark-1 bg-blue-1 text-white mt-20  mb-2  ">
                            <div>Reserve Room(s)</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >
        ) : null
      }
    </>
  );
};

export default AvailableRooms;
