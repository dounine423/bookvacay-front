import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withReactContent from "sweetalert2-react-content";
import { ClipLoader } from "react-spinners";
import { Modal, Button } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import FilterBox from "./component/filter-box";
import { adminHotelAction } from "../../../features/admin/adminHotel";
import { API } from '../../../pages/api/api'


const index = () => {
  const dispatch = useDispatch()
  const mySwal = withReactContent(Swal)
  const pageSize = 5

  const tabItems = [
    "All Booking",
    "Confirmed",
    "Cancelled",
    "Completed",
    "Refund Pending",
    "Cancelled & Refunded"
  ]

  const [keyword, setKeyWord] = useState("")
  const [duration, setDuration] = useState(null)
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true)
  const [hotelBooKData, setHBData] = useState([])
  const [modalFlag, setMFlag] = useState(false)
  const [request, setRFlag] = useState(true)
  const [pagination, setPagination] = useState(1)
  const [count, setCount] = useState(0)
  const [activeIndex, setActiveIndex] = useState(null)

  const handleTabClick = (index) => {
    setPagination(1)
    setActiveTab(index);
    setRFlag(true)
  };

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

  const getHotelBookData = async () => {
    setLoading(true)
    let req = {
      status: activeTab,
      duration,
      keyword,
      offset: pageSize * (pagination - 1),
      limit: pageSize
    }
    const { data } = await API.post('/getHotelBookDataByAdmin', req)
    if (data.success) {
      setHBData([...data.result.list])
      setCount(data.result.total)
    }
    else
      mySwal.fire('error', data.message, 'error')
    setLoading(false)
    setRFlag(false)
  }

  const getDate = (date) => {
    let f_date = moment(date)
    return f_date.format('YYYY-MM-DD')
  }

  const getDateTime = (date) => {
    if (date) {
      let curDate = moment.utc(date).toDate()
      return moment(curDate).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  const getStatus = (code) => {
    let data = {}
    switch (code) {
      case 1:
        data.text = 'Confirmed'
        data.color = ' bg-blue-1-05 text-blue-1'
        return data
      case 2:
        data.text = 'Cancelled'
        data.color = 'bg-red-3 text-red-2'
        return data
      case 3:
        data.text = 'Completed'
        data.color = 'bg-green-1 text-green-2'
        return data
      case 4:
        data.text = 'Refund Pending'
        data.color = ' bg-yellow-4 text-yellow-3'
        return data
      case 5:
        data.text = 'Cancelled & Refunded'
        data.color = ' bg-yellow-4 text-yellow-3'
        return data
      default:
        return ''
    }
  }

  const onHideModal = () => {
    setMFlag(false)
  }

  const onShowModal = (id) => {
    setActiveIndex(id)
    setMFlag(true)
  }

  const onPaginationHandler = (page) => {
    setPagination(page)
    setRFlag(true)
  }

  const onBookCancelHandler = async () => {
    setMFlag(false)
    setPagination(1)
    setActiveTab(0)
    setDuration(null)
    setKeyWord("")
    let params = {
      book_id: hotelBooKData[activeIndex]?.id,
      reference: hotelBooKData[activeIndex]?.reference
    }
    const { data } = await API.post('/cancelHotelBookByAdmin', params)
    if (data.success) {
      toast.success("Success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setHBData([...data.result.list])
      setCount(data.result.total)
      dispatch(adminHotelAction({ type: 'hotel', data: data.result }))
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

  const renderPax = (roomData) => {
    const { adult, child } = roomData
    return (
      <>
        <div>{adult == 1 ? "Adult" : "Adults"} {adult}</div>
        {child > 0 ? (<div>{child == 1 ? "Child" : "Children"} {child}</div>) : null}
      </>
    )
  }

  const onVoucherHandler = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank')
  }

  const onExportCSVAllData = async () => {
    let fileName = moment().format('YYYY-MM-DD+HH:mm:ss') + "-Hotel.csv"
    API.post('/getHotelBookCSVByAdmin', {
      data: ""
    }, {
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  }

  const getChangedAmount = (amount, rate, bank_mark_up) => {
    let curAmount = 0
    if (bank_mark_up != null) {
      curAmount = amount * rate * (1 + bank_mark_up / 100)
    } else {
      curAmount = amount * rate
    }
    return decimalAdjust('floor', curAmount, -2)
  }

  useEffect(() => {
    if (request) {
      getHotelBookData()
    }
  }, [request])

  return (
    <div className={"dashb  oard__content bg-light-2" + (loading ? " disable" : "")}>
      <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32" >
        <div className="col-auto">
          <ToastContainer />
          <h1 className="text-30 lh-14 fw-600">Hotel Booking History</h1>
        </div>
        <div className="col-auto">
          <FilterBox setFlag={setRFlag} setPagination={setPagination} getDates={setDuration} getSearch={setKeyWord} />
        </div>
      </div>

      <div className="py-30 px-30 rounded-4 bg-white shadow-3">
        <div className="tabs -underline-2 js-tabs">
          <div className="d-flex justify-between">
            <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
              {tabItems.map((item, index) => (
                <div className="col-auto" key={index}>
                  <button
                    className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${activeTab === index ? "is-tab-el-active" : ""
                      }`}
                    onClick={() => handleTabClick(index)}
                  >
                    {item}
                  </button>
                </div>
              ))}
            </div>
            <button onClick={onExportCSVAllData} className="button h-50 px-10 w-5 rounded-8 -dark-1 bg-blue-1 text-white">
              Export CSV
            </button>
          </div>

          <Modal show={modalFlag} onHide={onHideModal} size="xl" className="w-100">
            <Modal.Header closeButton>
              <Modal.Title>Booking Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-30">
              <div className="d-flex justify-between text-18">
                <span className="fw-500">{hotelBooKData[activeIndex]?.reference}</span>
                <span>{getDateTime(hotelBooKData[activeIndex]?.create_at)}</span>
                <span className={`rounded-100 py-4 px-10 text-center text-18 fw-500 ${getStatus(hotelBooKData[activeIndex]?.status).color}`}>{getStatus(hotelBooKData[activeIndex]?.status).text}</span>
              </div>
              <div className="d-flex justify-between mt-20" >
                <div className="w-50">
                  <p className="text-black text-18 fw-500 py-20">{hotelBooKData[activeIndex]?.hotel_name} in {hotelBooKData[activeIndex]?.destination}</p>
                </div>
                <div className="w-50">
                  <div className="row">
                    <div className="col-5">
                      <span>
                        Check-in
                      </span>
                    </div>
                    <div className="col-7">
                      {getDate(hotelBooKData[activeIndex]?.inDate)}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-5">
                      <span>Check-out</span>
                    </div>
                    <div className="col-7">
                      {getDate(hotelBooKData[activeIndex]?.outDate)}
                    </div>
                  </div>
                </div>
              </div>
              <table className="border-blue w-100">
                <thead>
                  <tr className="border-blue">
                    <th className="border-blue text-center" rowSpan={2}>#</th>
                    <th className="border-blue text-center" rowSpan={2}>Room Name</th>
                    <th className="border-blue text-center" rowSpan={2}>Paxes</th>
                    <th className="border-blue text-center" rowSpan={2}>Room Count</th>
                    <th className="border-blue text-center" rowSpan={2}>Payment Type</th>
                    <th className="border-blue text-center" rowSpan={2}>Net Amount</th>
                    <th className="border-blue text-center " rowSpan={2}>Taxes</th>
                    <th className="border-blue text-center" colSpan={2}>Cancellation Policy</th>
                  </tr>
                  <tr>
                    <th className="border-blue text-center">Amount</th>
                    <th className="border-blue text-center">DateFrom</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    hotelBooKData[activeIndex]?.room_data?.map((room, roomId) => (
                      <tr key={roomId}>
                        <td className="border-blue text-center">{roomId + 1}</td>
                        <td className="border-blue text-center">{room?.room_name}</td>
                        <td className="border-blue text-center">{renderPax(room)}</td>
                        <td className="border-blue text-center">{room?.room_count}</td>
                        <td className="border-blue text-center" >{room?.payment_type}</td>
                        <td className="border-blue text-center">{hotelBooKData[activeIndex]?.h_currency + " " + decimalAdjust('floor', room?.net_price, -2)}</td>
                        <td className="border-blue text-center">{hotelBooKData[activeIndex]?.h_currency + " " + decimalAdjust('floor', room?.tax, -2)}</td>
                        <td className="border-blue text-center">{room?.c_amount ? (hotelBooKData[activeIndex]?.h_currency + " " + decimalAdjust('floor', room?.c_amount, -2)) : null}</td>
                        <td className="border-blue text-center">{room?.c_date ? (getDateTime(room?.c_date?.split('+')[0])) : null}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <p className="text-black text-18 fw-500  py-20">Price Information</p>
              <div className="d-flex justify-between text-15">
                <span>
                  <span className="fw-500 mr-5">Total :</span>
                  <span>{hotelBooKData[activeIndex]?.c_currency + " " + getChangedAmount(hotelBooKData[activeIndex]?.paid, hotelBooKData[activeIndex]?.c_h_rate, hotelBooKData[activeIndex]?.bank_markup)} </span>
                  {
                    hotelBooKData[activeIndex]?.p_currency != hotelBooKData[activeIndex]?.c_currency ? (
                      <span>( {hotelBooKData[activeIndex]?.p_currency + " " + getChangedAmount(hotelBooKData[activeIndex]?.paid, hotelBooKData[activeIndex]?.z_h_rate)} )</span>
                    ) : null
                  }
                </span>
                {
                  hotelBooKData[activeIndex]?.net ? (
                    <span>
                      <span className="fw-500 mr-5">Net :</span> <span>
                        {(hotelBooKData[activeIndex]?.h_currency) + " " + hotelBooKData[activeIndex]?.net}
                      </span>
                      {
                        hotelBooKData[activeIndex]?.h_currency != hotelBooKData[activeIndex]?.p_currency ? (
                          <span>( {hotelBooKData[activeIndex]?.p_currency + " " + getChangedAmount(hotelBooKData[activeIndex]?.net, hotelBooKData[activeIndex]?.z_h_rate)} )</span>
                        ) : null
                      }

                    </span>
                  ) : null
                }

                {hotelBooKData[activeIndex]?.profit ? (
                  <span><span className="fw-500 mr-5">Profit :</span> <span>{hotelBooKData[activeIndex]?.p_currency + " " + getChangedAmount(hotelBooKData[activeIndex]?.profit, hotelBooKData[activeIndex]?.z_h_rate)}</span> </span>
                ) : null}
              </div>
              <div className="d-flex justify-between text-15">
                <span><span className="fw-500 mr-5">MarkUp :</span> <span>{hotelBooKData[activeIndex]?.hotel_markup} %</span>  </span>
                <span><span className="fw-500 mr-5">Billing Rate :</span> <span>{hotelBooKData[activeIndex]?.bank_markup} %</span>  </span>
                {
                  hotelBooKData[activeIndex]?.h_currency != hotelBooKData[activeIndex]?.p_currency ? (
                    <span><span className="fw-500 mr-5">{hotelBooKData[activeIndex]?.h_currency + "- >"} {hotelBooKData[activeIndex]?.p_currency}  :</span> <span>{hotelBooKData[activeIndex]?.z_h_rate} </span>  </span>
                  ) : null
                }
                {
                  hotelBooKData[activeIndex]?.h_currency != hotelBooKData[activeIndex]?.c_currency ? (
                    <span><span className="fw-500 mr-5">{hotelBooKData[activeIndex]?.h_currency + "- >"} {hotelBooKData[activeIndex]?.c_currency}  :</span> <span>{hotelBooKData[activeIndex]?.c_h_rate} </span>  </span>
                  ) : null
                }
              </div>
              <div className="text-center text-18 fw-500 row mt-20">
                <div className="col-9 d-flex justify-between">
                  <span>Token:</span>
                  <span> {hotelBooKData[activeIndex]?.uuid}</span>
                </div>
                <div className="col-3 d-flex justify-between">
                  <span>Payment Id:</span>
                  <span> {hotelBooKData[activeIndex]?.pf_id}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <p className="text-black text-18 fw-500  py-20">Holder Information</p>
                  <div className="row text-15">
                    <div className="col-3">
                      Name
                    </div>
                    <div className="col-9">
                      {hotelBooKData[activeIndex]?.holder_name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      Email
                    </div>
                    <div className="col-6">
                      {hotelBooKData[activeIndex]?.holder_email}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      Phone
                    </div>
                    <div className="col-9">
                      {hotelBooKData[activeIndex]?.holder_phone}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <p className="text-black text-18 fw-500 py-20">Invoice Information</p>
                  <div className="row">
                    <div className="col-5">
                      Invoice Company
                    </div>
                    <div className="col-7">
                      {hotelBooKData[activeIndex]?.invoice_company}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-5">
                      Invoice Registration Number
                    </div>
                    <div className="col-7">
                      {hotelBooKData[activeIndex]?.invoice_number}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-5">
                      Supplier Name
                    </div>
                    <div className="col-7">
                      {hotelBooKData[activeIndex]?.supply_name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-5">
                      Supplier VatNumber
                    </div>
                    <div className="col-7">
                      {hotelBooKData[activeIndex]?.supply_ref}
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {
                hotelBooKData[activeIndex]?.status == 4 ? (
                  <Button onClick={onBookCancelHandler} variant="success">
                    {/* {hotelBooKData[activeIndex]?.c_currency} {decimalAdjust('floor', hotelBooKData[activeIndex]?.paid, -2)} */}
                    <span className="px-10">Confirm</span>
                  </Button>) : null
              }

              <Button onClick={onHideModal} variant="secondary">
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="tabs__content pt-30 js-tabs-content">
            <div className="tabs__pane -tab-item-1 is-tab-el-active">
              <div className="overflow-scroll position-relative">
                <div className="position-absolute" style={{ top: '50px', left: '50%' }} >
                  <ClipLoader loading={loading} size={100} />
                </div>
                <table className=" text-15 col-12 table-3 border-blue " style={{ borderRadius: '0px' }} >
                  <thead className="bg-light-2">
                    <tr className="bg-blue-1 text-white border-blue">
                      <th className="border-blue " style={{ borderRadius: '0px' }}>#</th>
                      <th className="border-blue ">GUID</th>
                      <th className="border-blue ">Reference</th>
                      <th className="border-blue" >Hotel</th>
                      <th className="border-blue" >Destination</th>
                      <th className="border-blue" >Check-in - Check-out</th>
                      <th className="border-blue" >Total</th>
                      <th className="border-blue" >Net</th>
                      <th className="border-blue" >Profit</th>
                      <th className="border-blue" >Book Mark Up</th>
                      <th className="border-blue" >Voucher</th>
                      <th className="border-blue">Create At</th>
                      <th className="border-blue " style={{ borderRadius: '0px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      hotelBooKData.map((item, id) => (
                        <tr onClick={() => onShowModal(id)} key={id} className="border-blue">
                          <td className="v-middle border-blue">{pageSize * (pagination - 1) + id + 1}</td>
                          <td className="v-middle border-blue">
                            {item.pf_id}
                          </td>
                          <td className="v-middle border-blue">
                            {item.reference}
                          </td>
                          <td className="v-middle border-blue">
                            {item.hotel_name}
                          </td>
                          <td className="v-middle border-blue">
                            {item.destination}
                          </td>
                          <td className="v-middle border-blue">
                            <div>{getDate(item.inDate)}-</div>
                            <div> {getDate(item.outDate)}</div>
                          </td>
                          <td className="v-middle border-blue">
                            {item.c_currency + " " + getChangedAmount(item.paid, item.c_h_rate, item.bank_markup)}
                          </td>
                          <td className="v-middle border-blue">
                            {item?.net ? (item.h_currency + " " + item.net) : null}
                          </td>
                          <td className="v-middle border-blue">
                            {
                              item?.profit ? (
                                item.p_currency + " " + getChangedAmount(item.profit, item.z_h_rate)
                              ) : null
                            }
                            { }
                          </td>
                          <td className="v-middle border-blue text-center">
                            {item.hotel_markup} %
                          </td>
                          <td className="v-middle border-blue text-center">
                            {item?.voucher ? (
                              <a onClick={(e) => { onVoucherHandler(e, item.voucher) }} className="text-blue-1 fw-500 text-15 cursor-pointer">View</a>
                            ) : null}
                          </td>
                          <td className="v-middle border-blue">
                            {getDateTime(item.create_at)}
                          </td>
                          <td className="v-middle border-blue">
                            <span className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${getStatus(item.status).color}`}>{getStatus(item.status).text}</span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              <div className="mt-20" />
              <PaginationControl
                page={pagination}
                between={3}
                total={count}
                limit={pageSize}
                changePage={(page) => onPaginationHandler(page)}
                ellipsis={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default index;
