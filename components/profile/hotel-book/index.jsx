import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import { API } from '../../../pages/api/api'
import { userHotelAction } from "../../../features/user/userHotel";

const BookingTable = () => {
  const dispatch = useDispatch()
  const pageSize = 5
  const { userInfo } = useSelector(state => state.auth)
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState(true)
  const [pagination, setPagination] = useState(1)
  const [bookData, setBookData] = useState([])
  const [total, setTotal] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalFlag, setModal] = useState(false)

  const handleTabClick = (index) => {
    setPagination(1)
    setActiveTab(index);
    setRequest(true)
  };

  const tabItems = [
    "All Booking",
    "Confirmed",
    "Cancelled",
    "Completed",
    "Refund Pending",
    "Cancelled Refunded"
  ];

  const getBookedData = async () => {
    setLoading(true)
    let params = {
      status: activeTab,
      limit: pageSize,
      offset: (pagination - 1) * pageSize,
      user_id: userInfo?.id
    }
    const { data } = await API.post('/getHotelDataByUser', params)
    if (data.success) {
      setBookData([...data.result.list])
      setTotal(data.result.total)
    }
    setLoading(false)
    setRequest(false)
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

  const getDate = (date) => {
    if (date) {
      let f_date = moment(date)
      return f_date.format('YYYY-MM-DD')
    }
  }

  const getDateTime = (date) => {
    if (date) {
      let localTime = moment.utc(date).toDate()
      return moment(localTime).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  const getDateYMMD = (date) => {
    let f_date = moment(date)
    return f_date.format('DD MMMM YYYY')
  }

  const onPaginationHandler = (page) => {
    setPagination(page)
    setRequest(true)
  }

  const onTableTrHandler = (id) => {
    setActiveIndex(id)
    setModal(true)
  }

  const onHideModal = () => {
    setModal(false)
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
        data.text = 'Cancelled Refunded'
        data.color = ' bg-red-3 text-red-2'
        return data
      default:
        return ''
    }
  }

  const onCancelBooking = async () => {
    toast.info("Hotel booking cancelling", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setModal(false)
    setPagination(1)
    setActiveTab(0)
    let params = {
      user_id: userInfo?.id,
      book_id: bookData[activeIndex]?.id,
      reference: bookData[activeIndex]?.reference,
    }
    const { data } = await API.post('/cancelHotelBookByUser', params)

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
      setBookData([...data.result.list])
      setTotal(data.result.total)
      dispatch(userHotelAction({ type: 'totalHotel', data: data.result }))
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



  const onVoucherHandler = (e, url) => {
    e.stopPropagation()
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
      });
  }

  useEffect(() => {
    if (request) {
      getBookedData()
    }
  }, [request])

  return (
    <>
      <div className={"dashboard__content bg-light-2" + (loading ? " disable" : "")}>
        <ToastContainer />
        <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32" >
          <div className="col-auto">
            <h1 className="text-30 lh-14 fw-600">Hotel Booking History</h1>

          </div>
        </div>
        <div className="py-30 px-30 rounded-4 bg-white shadow-3">
          <div className="tabs -underline-2 js-tabs">
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
            <Modal show={modalFlag} onHide={onHideModal} size="xl" className="w-100">
              <Modal.Header closeButton>
                <Modal.Title>Booking Details</Modal.Title>
              </Modal.Header>
              <Modal.Body className="px-30">
                <div className="d-flex justify-between text-18">
                  <span className="fw-500">{bookData[activeIndex]?.reference}</span>
                  <span>{getDateTime(bookData[activeIndex]?.create_at)}</span>
                  <span className={`rounded-100 py-4 px-10 text-center text-18 fw-500 ${getStatus(bookData[activeIndex]?.status).color}`}>{getStatus(bookData[activeIndex]?.status).text}</span>
                </div>
                <div className="row ">
                  <div className="col-7">
                    <p className="text-black text-18 fw-500 py-20">{bookData[activeIndex]?.hotel_name} in {bookData[activeIndex]?.destination}</p>
                  </div>
                  <div className="col-5 justify-end">
                    <div className="row">
                      <div className="col-3">
                        <span>
                          Check-in
                        </span>
                      </div>
                      <div className="col-9">
                        {getDate(bookData[activeIndex]?.indate)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3">
                        <span>Check-out</span>
                      </div>
                      <div className="col-9">
                        {getDate(bookData[activeIndex]?.outdate)}
                      </div>
                    </div>
                  </div>
                </div>
                <table className="border-blue w-100">
                  <thead>
                    <tr className="border-blue">
                      <th className="border-blue text-center" rowSpan={2} >Room Name</th>
                      <th className="border-blue text-center" rowSpan={2}>Adult</th>
                      <th className="border-blue text-center" rowSpan={2}>Child</th>
                      <th className="border-blue text-center" rowSpan={2}>Room Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      bookData[activeIndex]?.room_data?.map((room, roomId) => (
                        <tr key={roomId}>
                          <td className="border-blue text-center">
                            <div>{room?.room_name}</div>
                            <div className="py-10 text-green-2 fw-700">Free Cancellation <span className="fw-500">
                              Until {getDateYMMD(room?.c_date)}
                            </span></div>
                          </td>
                          <td className="border-blue text-center">{room?.adult}</td>
                          <td className="border-blue text-center">{room?.child}</td>
                          <td className="border-blue text-center">{room?.room_count}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                {/* <div className="mt-10  fw-500 text-18">
                  <span >Payment ID :</span>
                  <span className="px-10"> {bookData[activeIndex]?.pf_id}</span>
                </div> */}
              </Modal.Body>
              <Modal.Footer>
                {
                  bookData[activeIndex]?.cancellation == 1 && bookData[activeIndex]?.status == 1 ? (
                    <Button onClick={onCancelBooking} variant="danger">
                      Cancel Booking
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
                        <th className="border-blue">#</th>
                        <th className="border-blue">GUID</th>
                        <th className="border-blue " style={{ borderRadius: '0px' }}>Reference</th>
                        <th className="border-blue" >Hotel</th>
                        <th className="border-blue" >Destination</th>
                        <th className="border-blue" >Check-in - Check-out</th>
                        <th className="border-blue" >Total</th>
                        <th className="border-blue" >Voucher</th>
                        <th className="border-blue">Create At</th>
                        <th className="border-blue " style={{ borderRadius: '0px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        bookData.map((item, id) => (
                          <tr onClick={() => onTableTrHandler(id)} key={id} className="border-blue">
                            <td className="v-middle border-blue">
                              {(pagination - 1) * pageSize + id + 1}
                            </td>
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
                              <div>
                                {getDate(item.indate)}-
                              </div>
                              <div className="py-10">
                                {getDate(item.outdate)}
                              </div>
                            </td>
                            <td className="v-middle border-blue">
                              {item.c_currency + " " + item.paid}
                            </td>
                            <td className="v-middle border-blue">
                              {item?.voucher ? (<a className="fw-500 text-blue-1 text-center cursor-pointer text-15" onClick={(e) => onVoucherHandler(e, item.voucher)} >View</a>) : null}
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
                  total={total}
                  limit={pageSize}
                  changePage={(page) => onPaginationHandler(page)}
                  ellipsis={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default BookingTable;
