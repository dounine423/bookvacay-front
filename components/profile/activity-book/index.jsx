
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import moment from "moment";
import { Modal, Button } from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners"
import { PaginationControl } from "react-bootstrap-pagination-control"
import { API } from '../../../pages/api/api'

const index = () => {
    const { userInfo } = useSelector(state => state.auth)
    const tabItems = [
        "All Booking",
        "Confirmed",
        "Cancelled",
        "Completed",
        "Refund Pending",
        "Cancelled, Refunded"
    ]
    const pageSize = 5
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(0)
    const [request, setRequest] = useState(true)
    const [modalFlag, setMFlag] = useState(false)
    const [activities, setActivities] = useState([])
    const [total, setTotal] = useState(0)
    const [pagination, setPagination] = useState(1)
    const [activeIndex, setActiveIndex] = useState(0)
    const [currency, setCurrency] = useState("EUR")

    const handleTabClick = (index) => {
        setPagination(1)
        setStatus(index)
        setRequest(true)
    }

    const hideModal = () => {
        setMFlag(false)
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

    const onTableTrClick = (id) => {
        setActiveIndex(id)
        setMFlag(true)
    }

    const getActivityData = async () => {
        setLoading(true)
        let params = {
            status,
            limit: pageSize,
            offset: (pagination - 1) * pageSize,
            user_id: userInfo?.id
        }
        const { data } = await API.post('/getActivityDataByUser', params)
        if (data.success) {
            setActivities([...data.result.list])
            setTotal(data.result.total)
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
        setRequest(false)
    }

    const onPaginationHandler = (page) => {
        setPagination(page)
        setRequest(true)
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
                data.color = 'bg-yellow-4 text-yellow-3'
                return data
            case 5:
                data.text = 'Cancelled Refunded'
                data.color = 'bg-red-3 text-red-2'
                return data
            default:
                return ''
        }
    }

    const getDate = (date) => {
        if (date) {
            let fDate = moment(date)
            // fDate = flag ? moment(date) : moment(date).add('day', 1)
            return fDate.format('YYYY-MM-DD')
        }
    }

    const getY3MD = (date) => {
        return moment(date).format('DD MMMM YYYY')
    }

    const getDateTime = (date) => {
        let localTime = moment.utc(date).toDate()
        return moment(localTime).format('YYYY-MM-DD HH:mm:ss')
    }

    const bookingCancellation = async () => {
        setMFlag(false)
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
        setPagination(1)
        setStatus(0)
        let params = {
            user_id: userInfo?.id,
            book_id: activities[activeIndex].id,
            reference: activities[activeIndex].reference
        }
        const { data } = await API.post('/cancelActivityBookByUser', params)
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
            setActivities([...data.result.list])
            setTotal(data.result.total)
        } else {
            toast.error("Cancelling is failed", {
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

    const renderPaxes = (paxInfo) => {
        let paxes = paxInfo.split('*')
        let renderData = []
        paxes.pop()
        paxes.map((pax, id) => {
            let detail = pax.split('#')
            renderData.push(<div key={id}>{detail[0] + " (" + detail[1] + " old)"}</div>)
        })
        return (
            <>
                {renderData}
            </>
        )
    }

    const onPrintVoucher = (e, url) => {
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
            getActivityData()
        } else {

        }
    }, [request])

    return (
        <div className={"dashboard__content bg-light-2" + (loading ? " disable" : "")}>
            <ToastContainer />
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32" >
                <div className="col-auto">
                    <h1 className="text-30 lh-14 fw-600">Activity Booking History</h1>

                </div>
                <div className="col-auto">
                    {/* <FilterBox setFlag={setRFlag} setPagination={setPagination} getDates={setDuration} getSearch={setKeyWord} /> */}
                </div>
            </div>

            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                <div className="tabs -underline-2 js-tabs">
                    <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
                        {tabItems.map((item, index) => (
                            <div className="col-auto" key={index}>
                                <button
                                    className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${status === index ? "is-tab-el-active" : ""
                                        }`}
                                    onClick={() => handleTabClick(index)}
                                >
                                    {item}
                                </button>
                            </div>
                        ))}
                    </div>
                    <Modal show={modalFlag} onHide={hideModal} size="xl" className="w-100">
                        <Modal.Header closeButton>
                            <Modal.Title>Booking Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="px-30">
                            <div className="d-flex justify-between text-18">
                                <span className="fw-500">{activities[activeIndex]?.reference}</span>
                                <span>{getDateTime(activities[activeIndex]?.create_at)}</span>
                                <span className={`rounded-100 py-4 px-10 text-center text-18 fw-500 ${getStatus(activities[activeIndex]?.status).color}`}>{getStatus(activities[activeIndex]?.status).text}</span>
                            </div>
                            <table className="border-blue w-100 py-20 mt-20">
                                <thead>
                                    <tr className="border-blue">
                                        <th className="border-blue text-center">#</th>
                                        <th className="border-blue text-center">Activity Info</th>
                                        <th className="border-blue text-center">Duration</th>
                                        <th className="border-blue text-center"> paxes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        activities[activeIndex]?.activities?.map((item, id) => (
                                            <tr key={id}>
                                                <td className="border-blue text-center px-10">{id + 1}</td>
                                                <td className="border-blue px-10">
                                                    <div className="row">
                                                        <div className="col-4 fw-500">Type:</div>
                                                        <div className="col-8">{item?.type}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-4 fw-500"> Activity:</div>
                                                        <div className="col-8">{item?.name}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-4 fw-500">Modality:</div>
                                                        <div className="col-8">{item?.modality}</div>
                                                    </div>
                                                    <div className="text-green-2 text-15"><span className="fw-700">Free Cancellation </span>  <span className="fw-500 px-10"> {item?.c_date ? (" Until " + getY3MD(item?.c_date)) : null}</span>  </div>
                                                </td>
                                                <td className="border-blue px-10">
                                                    <div className="row">
                                                        <div className="col-3 fw-500">From:</div>
                                                        <div className="col-9">{getDate(item?.from)}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-3 fw-500">To:</div>
                                                        <div className="col-9">{getDate(item?.to)}</div>
                                                    </div>
                                                </td>
                                                <td className="border-blue text-center px-10 col-2">{renderPaxes(item?.pax)}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </Modal.Body>
                        <Modal.Footer>
                            {
                                activities[activeIndex]?.status == 1 ? (
                                    <Button onClick={bookingCancellation} variant="danger">
                                        Cancellation Booking
                                    </Button>
                                ) : null
                            }
                            <Button onClick={hideModal} variant="secondary">
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
                                <table className="table-3 text-15 col-12 border-blue " style={{ borderRadius: '0px' }} >
                                    <thead className="bg-light-2">
                                        <tr className="bg-blue-1 text-white border-blue">
                                            <th className="border-blue" style={{ borderRadius: '0px' }}>#</th>
                                            <th className="border-blue ">GUID</th>
                                            <th className="border-blue ">Reference</th>
                                            <th className="border-blue" >Total</th>
                                            <th className="border-blue" >Voucher</th>
                                            <th className="border-blue" >Create</th>
                                            <th className="border-blue " style={{ borderRadius: '0px' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            activities.map((item, id) => (
                                                <tr key={id} onClick={() => onTableTrClick(id)} className="border-blue">
                                                    <td className="v-middle border-blue ">
                                                        {(pagination - 1) * pageSize + id + 1}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {item.uuid}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {item.reference}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {item.currency + " " + item.paid_amount}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {item?.voucher ? (
                                                            <div className="text-blue-1 fw-500 cursor-pointer text-center" onClick={(e) => onPrintVoucher(e, item.voucher)}>View</div>
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
    )
}

export default index