import { useState, useEffect } from "react"
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";
// import moment from 'moment-timezone'
import { Modal, Button } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control"
import { API } from '../../../pages/api/api'
import { adminActivityAction } from "../../../features/admin/adminActivity";

const index = () => {
    const dispatch = useDispatch()
    const pageSize = 5

    const tabItems = [
        "All Booking",
        "Confirmed",
        "Cancelled",
        "Completed",
        "Refund Pending",
        "Cancelled & Refunded"
    ]

    const [activeIndex, setActiveIndex] = useState(0)
    const [pagination, setPagination] = useState(1)
    const [total, setTotal] = useState(0)
    const [request, setRequest] = useState(true)
    const [actiivties, setActivities] = useState([])
    const [status, setStatus] = useState(0)
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)
    const [duration, setDuration] = useState(null)

    const handleTabClick = (index) => {
        setPagination(1)
        setStatus(index)
        setRequest(true)
    }

    const onPaginationHandler = (page) => {
        setPagination(page)
        setRequest(true)
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

    const getTotalCAmount = (bookData) => {
        if (bookData != null) {
            let total = 0
            const { activities, paid_amount, profit_amount, currency } = bookData
            activities.map((item) => {
                if (item.c_date) {
                    if (moment(item.c_date).isAfter(moment())) {
                        total += parseFloat(item.amount)
                    }
                }
            })
            total = decimalAdjust('floor', total, -2)
            return currency + " " + total
        }

    }

    const getActivityData = async () => {
        setLoading(true)
        let params = {
            status,
            limit: pageSize,
            offset: pageSize * (pagination - 1)
        }
        const { data } = await API.post('/getActivityDataByAdmin', params)
        if (data.success) {
            setActivities([...data.result.list])
            setTotal(data.result.total)
            dispatch(adminActivityAction({ type: 'totalActivity', data: data.result }))
        } else {

        }
        setLoading(false)
        setRequest(false)
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
                data.color = 'bg-red-3 text-red-2'
                return data
            default:
                return ''
        }
    }

    const getDate = (date, flag) => {
        if (date) {
            let fDate = moment(date)
            return fDate.format('YYYY-MM-DD')
        }
    }

    const getDateTime = (date) => {
        if (date) {
            let fDate = moment.utc(date).toDate()
            return moment(fDate).format('YYYY-MM-DD HH:mm:ss')
        }
    }

    const hideModal = () => {
        setModal(false)
    }

    const onTableTrClick = (id) => {
        setActiveIndex(id)
        setModal(true)
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

    const onVoucherHandler = (e, url) => {
        e.stopPropagation();
        window.open(url, '_blank')
    }

    const confirmCancelling = async () => {
        setModal(false)
        let params = {
            book_id: actiivties[activeIndex].id,
            reference: actiivties[activeIndex].reference
        }
        const { data } = await API.post('/cancelActivityBookByAdmin', params)
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
            dispatch(adminActivityAction({ type: 'totalActivity', data: data.result }))
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

    const onExportCSVAllData = () => {
        let fileName = moment().format('YYYY-MM-DD+HH:mm:ss') + "-Activity.csv"
        API.post('/getActivityBookCSVByAdmin', {
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

    const changeRatePrice = (amount, rate, currency) => {
        if (amount)
            return currency + " " + decimalAdjust('floor', rate * amount, -2)
        else
            return ""
    }

    useEffect(() => {
        if (request) {
            getActivityData()
        }
    }, [request])

    return (
        <div className={"dashboard__content bg-light-2" + (loading ? " disable" : "")}>
            <ToastContainer />
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32" >
                <div className="col-auto">
                    <h1 className="text-30 lh-14 fw-600">Activity Booking History</h1>

                </div>
            </div>

            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                <div className="tabs -underline-2 js-tabs">
                    <div className="d-flex justify-between">
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
                        <button onClick={onExportCSVAllData} className="button h-50 px-10 w-5 rounded-8 -dark-1 bg-blue-1 text-white">
                            Export CSV
                        </button>
                    </div>

                    <Modal show={modal} onHide={hideModal} size="xl" className="w-100">
                        <Modal.Header closeButton>
                            <Modal.Title>Booking Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="px-30">
                            <div className="d-flex justify-between text-18">
                                <span className="fw-500">{actiivties[activeIndex]?.reference}</span>
                                <span>{getDateTime(actiivties[activeIndex]?.create_at)}</span>
                                <span className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${getStatus(actiivties[activeIndex]?.status).color}`}>{getStatus(actiivties[activeIndex]?.status).text}</span>
                            </div>
                            <table className="border-blue w-100 py-20 mt-20">
                                <thead>
                                    <tr className="border-blue">
                                        <th className="border-blue text-center" rowSpan={2}>#</th>
                                        <th className="border-blue text-center" rowSpan={2}>Activity Info</th>
                                        <th className="border-blue text-center" rowSpan={2}>Duration</th>
                                        <th className="border-blue text-center" rowSpan={2}>Amount</th>
                                        <th className="border-blue text-center" rowSpan={2}> paxes</th>
                                        <th className="border-blue text-center" rowSpan={2}>Supplier Info</th>
                                        {/* <th className="border-blue text-center" rowSpan={2}>Provider</th> */}
                                        <th className="border-blue text-center" colSpan={2}>Cancelllation Policy</th>
                                    </tr>
                                    <tr>
                                        <th className="border-blue text-center">Amount</th>
                                        <th className="border-blue text-center">DateFrom</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        actiivties[activeIndex]?.activities?.map((item, id) => (
                                            <tr key={id}>
                                                <td className="border-blue text-center px-10">{id + 1}</td>
                                                <td className="border-blue col-3 px-10">
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
                                                    <div className="row">
                                                        <div className="col-4 fw-500">Destination:</div>
                                                        <div className="col-8">{item?.destination}</div>
                                                    </div>
                                                </td>
                                                <td className="border-blue col-2 px-10">
                                                    <div className="row">
                                                        <div className="col-3 fw-500">From:</div>
                                                        <div className="col-9">{getDate(item?.from, false)}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-3 fw-500">To:</div>
                                                        <div className="col-9">{getDate(item?.to, false)}</div>
                                                    </div>
                                                </td>
                                                <td className="border-blue text-center px-10 col-1">{actiivties[activeIndex]?.h_currency + " " + decimalAdjust('floor', item?.amount, -2)}</td>
                                                <td className="border-blue text-center px-10 col-2">{renderPaxes(item?.pax)}</td>
                                                <td className="border-blue px-10 col-2">
                                                    <div className="row">
                                                        <div className="col-3">Name:</div>
                                                        <div className="col-9">{item?.supply_name}</div>
                                                    </div>
                                                    <div >VatNumber:</div>
                                                    <div >{item?.supply_vat}</div>
                                                </td>
                                                {/* <td className="border-blue text-center col-1 px-10" >{item?.provider_name}</td> */}
                                                <td className="border-blue text-center col-1 px-10" >{item?.c_amount ? (actiivties[activeIndex]?.h_currency + " " + item.c_amount) : null}</td>
                                                <td className="border-blue text-center col-1 px-10" >{item?.c_date ? getDateTime(item?.c_date?.split('T')[0]) : ""}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <p className="text-black text-18 fw-500  py-20">Price Information</p>
                            <div className="d-flex justify-between text-15">
                                <span>
                                    <span className="fw-500 mr-5">Total :</span>
                                    <span>{changeRatePrice(actiivties[activeIndex]?.paid_amount, actiivties[activeIndex]?.c_h_rate, actiivties[activeIndex]?.c_currency)}</span>
                                    {
                                        actiivties[activeIndex]?.c_currency != actiivties[activeIndex]?.p_currency ? (
                                            <span className="fw-500 mr-5">( {changeRatePrice(actiivties[activeIndex]?.paid_amount, actiivties[activeIndex]?.z_h_rate, actiivties[activeIndex]?.p_currency)} ) </span>
                                        ) : null
                                    }
                                </span>
                                <span>
                                    <span className="fw-500 mr-5">Net :</span>
                                    <span>{changeRatePrice(actiivties[activeIndex]?.total_amount, 1, actiivties[activeIndex]?.h_currency)}</span>
                                    <span className="fw-500 mr-5">( {changeRatePrice(actiivties[activeIndex]?.total_amount, actiivties[activeIndex]?.z_h_rate, actiivties[activeIndex]?.p_currency)} )</span>
                                </span>
                                <span>
                                    <span className="fw-500 mr-5">Profit :</span>
                                    <span>{changeRatePrice(actiivties[activeIndex]?.profit_amount, actiivties[activeIndex]?.z_h_rate, actiivties[activeIndex]?.p_currency)}</span>
                                </span>
                            </div>
                            <div className="py-20 text-black text-18 d-flex justify-between">
                                <span>
                                    <span className="fw-500 mr-5">Book markup :</span>
                                    <span>{actiivties[activeIndex]?.book_mark_up} %</span>
                                </span>
                                <span>
                                    <span className="fw-500 mr-5">BillRate :</span>
                                    <span>{actiivties[activeIndex]?.bank_mark_up} %</span>
                                </span>
                                {
                                    actiivties[activeIndex]?.c_currency != actiivties[activeIndex]?.h_currency ? (
                                        <span>
                                            <span className="fw-500 mr-5">{actiivties[activeIndex]?.c_currency + " > "}  {actiivties[activeIndex]?.h_currency}</span>
                                            <span className="px-5">{actiivties[activeIndex]?.c_h_rate} </span>
                                        </span>
                                    ) : null
                                }
                                <span>
                                    <span className="fw-500 mr-5">{actiivties[activeIndex]?.p_currency + " > "}  {actiivties[activeIndex]?.h_currency}</span>
                                    <span className="px-5">{actiivties[activeIndex]?.z_h_rate} </span>
                                </span>
                            </div>
                            <div className="text-center text-18 fw-500 row mt-20">
                                <div className="col-9 d-flex justify-between">
                                    <span>Token:</span>
                                    <span> {actiivties[activeIndex]?.uuid}</span>
                                </div>
                                <div className="col-3 d-flex justify-between">
                                    <span>Payment Id:</span>
                                    <span> {actiivties[activeIndex]?.pf_id}</span>
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
                                            {actiivties[activeIndex]?.holder_name}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3">
                                            Email
                                        </div>
                                        <div className="col-6">
                                            {actiivties[activeIndex]?.holder_email}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3">
                                            Phone
                                        </div>
                                        <div className="col-9">
                                            {actiivties[activeIndex]?.holder_phone}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3">
                                            Address
                                        </div>
                                        <div className="col-9">
                                            {actiivties[activeIndex]?.holder_address}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3">
                                            ZipCode
                                        </div>
                                        <div className="col-9">
                                            {actiivties[activeIndex]?.holder_zipcode}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <p className="text-black text-18 fw-500  py-20">Invoice </p>
                                    <div className="row">
                                        <div className="col-5">
                                            Invoice Company
                                        </div>
                                        <div className="col-7">
                                            {actiivties[activeIndex]?.invoice_company}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-5">
                                            Invoice Registration Number
                                        </div>
                                        <div className="col-7">
                                            {actiivties[activeIndex]?.invoice_vat}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {
                                actiivties[activeIndex]?.status == 4 ? (
                                    <Button onClick={confirmCancelling} variant="primary">
                                        {/* {getTotalCAmount(actiivties[activeIndex])} */}
                                        <span className="px-10">Confirm</span>
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
                                            <th className="border-blue" >Net</th>
                                            <th className="border-blue" >Profit</th>
                                            <th className="border-blue" >Book markup</th>
                                            <th className="border-blue" >Voucher</th>
                                            <th className="border-blue" >Create At</th>
                                            <th className="border-blue " style={{ borderRadius: '0px' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            actiivties.map((item, id) => (
                                                <tr key={id} onClick={() => onTableTrClick(id)} className="border-blue">
                                                    <td className="v-middle border-blue ">
                                                        {(pagination - 1) * pageSize + id + 1}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {item.pf_id}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {item.reference}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {changeRatePrice(item.paid_amount, item.c_h_rate, item.c_currency)}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {changeRatePrice(item.total_amount, 1, item.h_currency)}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {changeRatePrice(item.profit_amount, item.z_h_rate, item.p_currency)}
                                                    </td>
                                                    <td className="v-middle border-blue">
                                                        {item.book_mark_up} %
                                                    </td>
                                                    <td className="v-middle border-blue text-center">
                                                        {item?.voucher ? (
                                                            <a className="text-blue-1 cursor-pointer fw-700" onClick={(e) => { onVoucherHandler(e, item.voucher) }}> View</a>
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