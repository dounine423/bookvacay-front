import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Router, { withRouter } from "next/router";
import dynamic from "next/dynamic";
import { ClipLoader } from "react-spinners";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Seo from "../../../components/common/Seo";
import Header11 from "../../../components/header/header-11";
import Footer5 from "../../../components/footer/footer-5";
import TopHeaderFilter from '../../../components/hotel/hotel-list/TopHeaderFilter'
import MainFilterSearchBox from "../../../components/hotel/common/MainFilterSearchBox";
import HotelProperties from "../../../components/hotel/hotel-list/HotelProperties";
import Sidebar from "../../../components/hotel/hotel-list/Sidebar";
import { API } from '../../api/api'
import { hotelOperation } from '../../../features/hotels/hotelSlice'
import { regionAction } from '../../../features/region/region'

const index = () => {
  const dispatch = useDispatch()
  const { LoggedIn } = useSelector(state => state.auth)
  const { facilities, currency } = useSelector(state => state.region)
  const { availability, filter, pagination, request, index, total_avail, total_content, defaultFilter } = useSelector(state => state.hotel)

  const pageSize = 8
  const [curPage, setCurrentPage] = useState(pagination);
  const [loading, setLoading] = useState(false)
  const [curReguest, setRequest] = useState(false)
  const [currencyFlag, setCurrencyFlag] = useState(false)
  const [filterData, setFilter] = useState(filter)
  const [curFacility, setCurFacility] = useState(facilities)

  const getHotelsAvail = async (req) => {
    setLoading(true)
    dispatch(hotelOperation({ type: 'request', data: true }))
    // console.log("hotel avail request", req)
    const { data } = await API.post('/getHotelAvailability', req)
    // console.log("hotelAvail", data)
    if (data.success) {
      dispatch(hotelOperation({ type: 'total_avail', data: data.result }))
      let hotelCodes = ""
      data.result.hotels.slice(0, 8).map((item) => {
        hotelCodes += item.code + ", "
      })
      getHotelContent({ hotelCodes })
    }
    else {
      dispatch(hotelOperation({ type: 'total_avail', data: { total: 0, hotels: [] } }))
      dispatch(hotelOperation({ type: "total_content", data: [] }))
      setLoading(false)
    }
    dispatch(hotelOperation({ type: 'request', data: false }))
    setRequest(false)
  }

  const getHotelContent = async (req) => {
    setLoading(true)
    dispatch(hotelOperation({ type: "total_content", data: null }))
    const { data } = await API.post('/getHotelContent', req)
    // console.log("hotel content", data)
    if (data.success)
      dispatch(hotelOperation({ type: 'total_content', data: data.result }))
    else
      console.log(data.message)
    setLoading(false)
  }

  const initHotelProps = () => {
    dispatch(hotelOperation({ type: 'reserve', data: null }))
    dispatch(hotelOperation({ type: 'pagination', data: 1 }))
  }

  const onHandlePagination = (page) => {
    setCurrentPage(page)
    dispatch(hotelOperation({ type: 'pagination', data: page }))
    let hotelCodes = ""
    total_avail.hotels.slice((page - 1) * pageSize, page * pageSize).map((item) => {
      hotelCodes += item.code + ", "
    })
    getHotelContent({ hotelCodes })
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

  const saveValue = () => {
    dispatch(regionAction({ type: 'facilities', data: curFacility }))
    dispatch(hotelOperation({ type: 'filter', data: filterData }))
  }

  const makeFilterData = (filterData) => {
    let minRate = filterData.min
    let maxRate = filterData.max
    let request = {}
    let data = {
      minRate,
      maxRate,
      maxCategory: 5,
      paymentType: "AT_WEB",
    }
    if (filterData.category != null)
      data['minCategory'] = filterData.category
    request['filter'] = data
    let tempBoard = []
    filterData.board.map((item) => {
      tempBoard.push(item.code)
    })
    if (tempBoard.length != 0) {
      let boardFilter = {
        included: true,
        board: tempBoard
      }
      request['boards'] = boardFilter
    }
    return request
  }

  const makeFacilityData = (facilityData) => {
    let result = []
    facilityData.map((group) => {
      let facility = []
      group.data.map((item) => {
        if (item.checked)
          facility.push(item.code)
      })
      if (facility.length > 0)
        result.push({
          column: group.column,
          facility
        })
    })
    return result
  }

  const onChangeCurrencyHandler = async (currency) => {
    // let tempFilter = JSON.parse(JSON.stringify(filterData))
    // tempFilter.max = defaultFilter.max
    // tempFilter.min = defaultFilter.min
    // setFilter(tempFilter)
    setRequest(true)
    const { data } = await API.post('getCurrentCurrency', currency)
    if (data.success) {
      dispatch(regionAction({ type: 'currencyInfo', data: data.result }))
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
  }

  useEffect(() => {
    if (LoggedIn == false) {
      Router.push({
        pathname: '/login'
      })
    } else {
      if (curReguest == true || request == true) {
        setCurrentPage(1)
        initHotelProps()
        let facilityTemp = makeFacilityData(curFacility)
        let filterTemp = makeFilterData(filterData)
        getHotelsAvail({ ...availability, ...filterTemp, facility: facilityTemp, currency })
      }
    }
    return () => { saveValue() }
  }, [curReguest])

  return (
    <>
      {
        LoggedIn ? (
          <div>
            <Seo pageTitle={"Hotels in " + index?.name} />
            <div className="header-margin"></div>
            <Header11 currencyHandler={onChangeCurrencyHandler} />
            <ToastContainer />
            <section className="section-bg pt-40 pb-40 relative z-5">
              <div className="section-bg__item col-12">
                <img
                  src="/img/misc/bg-1.png"
                  alt="image"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="container">
                <div className="row">
                  <div className={"col-12" + (loading ? " disable" : "")}>
                    <div className="text-center">
                      <h1 className="text-30 fw-600 text-white">
                        Find Your Dream Luxury Hotel
                      </h1>
                    </div>
                    <MainFilterSearchBox
                      setRequest={setRequest}
                      setFilter={setFilter}
                      setFacility={setCurFacility}
                    />
                  </div>
                </div>
              </div>
            </section >
            < section className="layout-pt-md layout-pb-lg" >
              <div className="container">
                <div className="row y-gap-20 justify-between ">
                  <div className={"col-xl-3 mt-30" + (loading ? " disable" : "")}>
                    <aside className="sidebar y-gap-40 xl:d-none">
                      <Sidebar getValue={setRequest} facilities={curFacility} getFacility={setCurFacility} filterData={filterData} setFilterData={setFilter} />
                    </aside>
                    <div
                      className="offcanvas offcanvas-start"
                      tabIndex="-1"
                      id="listingSidebar"
                    >
                      <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasLabel">
                          Filter Activity
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="offcanvas-body">
                        <aside className="sidebar y-gap-40  xl:d-block">
                          <Sidebar getValue={setRequest} facilities={curFacility} getFacility={setCurFacility} filterData={filterData} setFilterData={setFilter} />
                        </aside>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-9 position-relative">
                    <div className="absolute" style={{ top: '100px', left: '50%' }}>
                      <ClipLoader loading={loading} size={100} />
                    </div>
                    {
                      (total_content != null && loading == false) ? (<div className={loading ? "disable" : ""}>
                        <div className="border-top-light mt-30 mb-30"></div>
                        <TopHeaderFilter location={index?.type == 0 ? index.content : index.name} total={total_avail.total} />
                        {
                          total_content.map((content, contentId) => (
                            <HotelProperties
                              key={contentId}
                              hotelData={content}
                              hotelAvail={total_avail.hotels[((curPage - 1) * pageSize + contentId)]}
                              availData={availability}
                              contentId={contentId}
                              availId={(curPage - 1) * pageSize + contentId}
                            />
                          ))
                        }
                        <PaginationControl
                          page={curPage}
                          between={3}
                          total={total_avail.total}
                          limit={pageSize}
                          changePage={(page) => onHandlePagination(page)}
                          ellipsis={1}
                        />
                      </div>) : null
                    }
                  </div>
                </div>
              </div>
            </section >
            < Footer5 />
          </div>
        ) : null
      }
    </>
  );
};

export default withRouter(index);
