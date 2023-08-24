import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Router, { withRouter } from "next/router";
import { Gallery, Item } from "react-photoswipe-gallery";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "photoswipe/dist/photoswipe.css";
import 'react-notifications/lib/notifications.css';
import Seo from "../../../components/common/Seo";
import Header11 from "../../../components/header/header-11";
import Footer5 from "../../../components/footer/footer-5";
import Overview from "../../../components/hotel/hotel-detail/Overview";
import PopularFacilities from "../../../components/hotel/hotel-detail/PopularFacilities";
import StickyHeader from "../../../components/hotel/hotel-detail/StickyHeader";
import TopBreadCrumb from "../../../components/hotel/hotel-detail/TopBreadCrumb";
import SidebarRight from "../../../components/hotel/hotel-detail/SidebarRight";
import AvailableRooms from "../../../components/hotel/hotel-detail/AvailableRooms";
import Surroundings from "../../../components/hotel/hotel-detail/Surroundings";
import HelpfulFacts from '../../../components/hotel/hotel-detail/HelpfulFacts'
import { API } from '../../../pages/api/api'
import { hotelOperation } from "../../../features/hotels/hotelSlice";
import { regionAction } from "../../../features/region/region";

const index = (props) => {
  const dispatch = useDispatch()
  const { LoggedIn } = useSelector(state => state.auth)
  const { total_avail, total_content, imageUrl, index, availability } = useSelector(state => state.hotel)
  const { contentId, availId } = props.router.query;
  const [hotelAvail, setHAvail] = useState(null)
  const [hotelContent, setHContent] = useState(null)
  const [loading, setLoading] = useState(false)

  const getRoomsFromHotel = () => {
    const { images, roomData } = hotelContent;
    let parsedRooms = [];
    hotelAvail?.rooms?.map((item, id) => {
      let roomImgs = []
      images?.map((imageEle) => {
        if (imageEle.roomCode == item.code)
          roomImgs.push(imageEle)
      });
      let facility = roomData?.find((ele) => {
        return item.code == ele.roomCode
      })
      let temp = {
        ...item,
        roomImgs,
        ...facility
      }
      parsedRooms.push(temp);
    })
    return parsedRooms;
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

  const renderImageOfHotel = (path, index) => {
    if (index < 5) {
      if (index == 4) {
        return (
          <>
            <img
              src={imageUrl + path}
              alt="image"
              className="rounded-4"
            />
            <div className="absolute px-10 py-10 col-12 h-full d-flex justify-end items-end">
              <Item
                original={imageUrl + path}
                thumbnail={imageUrl + path}
                width={660}
                height={660}
              >
                {({ ref, open }) => (
                  <div
                    className="button -blue-1 px-24 py-15 bg-white text-dark-1 js-gallery"
                    ref={ref}
                    onClick={open}
                    role="button"
                  >
                    See All Photos
                  </div>
                )}
              </Item>
            </div>
          </>
        )
      } else {
        return (
          <Item
            original={imageUrl + path}
            thumbnail={imageUrl + path}
            width={660}
            height={660}
          >
            {({ ref, open }) => (
              <img
                src={imageUrl + path}
                ref={ref}
                onClick={open}
                alt="image"
                role="button"
                className="rounded-4"
              />
            )}
          </Item>
        )
      }

    } else {
      return (
        <Item
          original={imageUrl + path}
          thumbnail={imageUrl + path}
          width={660}
          height={660}
        >
          {({ ref, open }) => (
            <img
              src={imageUrl + path}
              ref={ref}
              onClick={open}
              alt="image"
              role="button"
              className="rounded-4 d-none"
            />
          )}
        </Item>
      )
    }

  }

  const getDateTime = (date) => {
    return moment(date).format('MMMM DD YYYY');
  }

  const getRateCommentIds = (roomData) => {
    let ids = []
    let tempRoom = []
    roomData.map((room) => {
      let tempRates = []
      room.rates.map((rate) => {
        let temp
        if (rate.rateCommentsId) {
          let index = ids.findIndex((item) => {
            return item == rate.rateCommentsId
          })
          if (index < 0) {
            temp = {
              ...rate,
              rateIndex: ids.length
            }
            ids.push(rate.rateCommentsId)
          } else {
            temp = {
              ...rate,
              rateIndex: index
            }
          }
        } else {
          temp = {
            ...rate,
            rateIndex: null
          }
        }
        tempRates.push(temp)
      })
      tempRoom.push({
        ...room,
        rates: tempRates
      })
    })
    let result = {
      ids,
      rooms: tempRoom
    }
    return result
  }

  const getRoomRateComment = async (ids, hotelAvailData, rooms) => {
    setLoading(true)
    let tempRoom = []
    let request = {
      ids,
      checkIn: availability.inDate
    }
    const { data } = await API.post('/getRoomRateComment', request)
    if (data.success) {
      let rateComments = data.result
      rooms.map((room) => {
        let tempRates = []
        room.rates.map((rate) => {
          let tempRateData = {
            ...rate,
            rateComment: rateComments[rate.rateIndex]
          }
          tempRates.push(tempRateData)
        })
        tempRoom.push({
          ...room,
          rates: tempRates
        })
      })
      setHAvail({
        ...hotelAvailData,
        rooms: tempRoom
      })
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
      setHAvail(hotelAvailData)
    }
    setLoading(false)
  }

  const getExtraCost = () => {
    let result = []
    hotelContent.facilities.slice(1).map((group) => {
      group.data.map((item) => {
        if (item.indFee)
          result.push(item)
      })
    })
    return result
  }

  const onChangeCurrencyHandler = async (currency) => {
    setLoading(true)
    let tempRooms = JSON.parse(JSON.stringify(hotelAvail.rooms))
    const { data } = await API.post('/getCurrentCurrency', currency)
    if (data.success) {
      let currencyInfo = data.result
      dispatch(hotelOperation({ type: 'request', data: true }))
      dispatch(regionAction({ type: 'currencyInfo', data: currencyInfo }))
      tempRooms.map((room) => {
        room.rates.map((rate) => {
          let clientPrice = rate.hotelPrice * (1 + currencyInfo.bank_mark_up / 100) * currencyInfo.client
          clientPrice = decimalAdjust('floor', clientPrice, -2)
          rate['clientPrice'] = clientPrice
          if (rate.pureTax) {
            rate.clientTax = rate.pureTax * currencyInfo.client
          }
        })
      })
      setHAvail({ ...hotelAvail, rooms: tempRooms })
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

  useEffect(() => {
    if (LoggedIn == false) {
      Router.push({ pathname: '/login' })
    } else {
      let hotelAvailData = total_avail?.hotels[availId]
      let rateComment = getRateCommentIds(hotelAvailData.rooms)
      if (rateComment.ids.length > 0) {
        getRoomRateComment(rateComment.ids, hotelAvailData, rateComment.rooms)
      } else {
        setHAvail(total_avail?.hotels[availId])
      }
      setHContent(total_content[contentId])
    }
  }, [LoggedIn])

  return (
    <>
      {
        hotelContent ? (
          <>
            <Seo pageTitle={"Hotel/" + hotelContent.name} />
            <div className="header-margin"></div>
            <Header11 currencyHandler={onChangeCurrencyHandler} />
            <TopBreadCrumb location={index?.name} hotelName={hotelContent.name} />
            <StickyHeader />
            <ToastContainer />
            <section className="pt-40">
              <div className="container">
                <div>
                  <div className="d-flex items-center">
                    <h1 className="text-30 sm:text-25 fw-600 mr-10">{hotelContent.name}</h1>
                    <div>
                      {
                        Array(parseInt(hotelContent.category)).fill().map((_, i) => (
                          <i key={i} className="icon-star text-20 text-yellow-1" />
                        ))
                      }
                    </div>
                  </div>
                  <div className="d-flex text-blue-1 items-center">
                    <i className="icon-location text-20 mr-5 " />
                    <span className="fw-500">{hotelContent.address + " , " + hotelContent.city}</span>
                  </div>
                  <div className="d-flex items-center text-blue-1">
                    {
                      hotelContent.webUrl != null ? (
                        <a href={hotelContent.webUrl} className="d-flex items-center fw-500" target="_blank">
                          <i className="icon-globe text-20 mr-5" />
                          {hotelContent.webUrl}
                        </a>
                      ) : null
                    }
                  </div>
                </div>
                {
                  hotelContent?.issues?.map((issue, issueId) => (
                    <div key={issueId} className="mt-10 px-10 py-10 border rounded-4">
                      <div className="d-flex justify-between">
                        <h6>{issue.type}</h6>
                        <div>
                          <span className="ml-10">{issue.dateFrom ? getDateTime(issue.dateFrom) : null}</span>
                          <span className="ml-10">{issue.dateFrom ? getDateTime(issue.dateTo) : null}</span>
                        </div>
                      </div>
                      <p className="mt-10 text-black fw-200">{issue.content}</p>
                    </div>
                  ))
                }
                <div className="row y-gap-20 mt-20">
                  <div className="col-xl-3 px-15 d-flex" >
                    <div className="flex-fill">
                      <SidebarRight />
                    </div>

                  </div>
                  <div className="col-xl-9 d-flex">
                    <div className="flex-fill">
                      <Gallery>
                        <div className="galleryGrid -type-1 ">
                          {
                            hotelContent?.images?.map((img, imgId) => (
                              <div key={imgId} className="galleryGrid__item relative d-flex">
                                {renderImageOfHotel(img.path, imgId)}
                              </div>
                            ))
                          }
                        </div>
                      </Gallery>
                    </div>

                  </div>
                </div>
              </div >
            </section >
            <section className="pt-30">
              <div className="container">
                <div className="row y-gap-30">
                  <div className="col-xl-12">
                    <div className="row y-gap-40">
                      <div id="overview" className="col-12">
                        <Overview description={hotelContent.description} />
                      </div>
                      <div className="col-12">
                        <h3 className="text-22 fw-500 pt-40 border-top-light">
                          Most Popular Facilities
                        </h3>
                        <div className="row y-gap-10 pt-40 px-10" id="facilities">
                          <PopularFacilities facilityList={hotelContent.facilities?.slice(1, -1)} />
                          <p className="text-black">*Some services shall be paid at the establishment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="rooms" className="pt-30">
              <div className="container position-relative">
                <div className="row pb-20">
                  <div className="col-auto">
                    <h3 className="text-22 fw-500">Available Rooms</h3>
                  </div>
                </div>
                {
                  loading ? (
                    <div className="absolute" style={{ top: '30px', left: '50%' }}>
                      <ClipLoader size={100} loading={true} />
                    </div>
                  ) : (
                    <AvailableRooms
                      roomData={getRoomsFromHotel()}
                      key="avail"
                      contentId={contentId}
                      availId={availId}
                    />
                  )
                }
              </div>
            </section>
            <section className="pt-40">
              <div className="container">
                <div className="pt-40">
                  <div className="row">
                    <div className="col-12">
                      <h3 className="text-22 fw-500">Some helpful facts</h3>
                    </div>
                  </div>
                  <div className="row x-gap-50 y-gap-30 pt-20 px-20">
                    <HelpfulFacts facts={hotelContent.facilities[0]} indFee={getExtraCost()} />
                  </div>
                </div>
              </div>
            </section>
            <section className="pt-40">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <h3 className="text-22 fw-500">Hotel surroundings</h3>
                  </div>
                </div>
                <div className="row x-gap-50 y-gap-30 pt-20 mb-20">
                  <Surroundings interestPoints={hotelContent.interestPoints} terminals={hotelContent.terminals} />
                </div>

              </div>
            </section>

            <Footer5 />
          </>
        ) : null
      }
    </>
  );
};

export default withRouter(index);
