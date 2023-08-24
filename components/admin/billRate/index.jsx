import { useState, useEffect } from "react";
import moment from "moment";
import { Form, Modal } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API } from "../../../pages/api/api";

const index = () => {
    const pageSize = 5
    const [modalFlag, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState(1)
    const [request, setRequest] = useState(true)
    const [billRate, setBillRate] = useState([])
    const [total, setTotal] = useState(0)
    const [newRate, setNewRate] = useState({ value: "", error: true })
    const [newText, setNewText] = useState({ value: "", error: true })

    const hideModal = () => {
        setModal(false)
    }

    const onNewHandler = () => {
        setModal(true)
    }

    const getDate = (date) => {
        let fDate = moment.utc(date).toDate()
        return moment(fDate).format('YYYY-MM-DD hh:mm:ss')
    }

    const getTotalBillRate = async () => {
        setLoading(true)
        let params = {
            limit: pageSize,
            offset: pageSize * (pagination - 1)
        }
        const { data } = await API.post('/getBillRateListByAdmin', params)
        if (data.success) {
            const { total, result } = data.result
            setTotal(total)
            setBillRate(result)
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

    const insertNewBillRate = async () => {
        setModal(false)
        if (checkFormData()) {
            let params = {
                rate: newRate.value,
                comment: newText.value
            }
            const { data } = await API.post('/insertBillRateByAdmin', params)
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
                const { result, total } = data.result
                setTotal(total)
                setBillRate(result)
                setNewRate({ value: 0, error: true })
                setNewText({ value: "", error: true })
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

    }

    const checkFormData = () => {
        if (newRate.value != "" && newRate.error && newText.value != "" && newText.error) {
            return true
        } else {
            return false
        }
    }

    const newRateChangeHandler = (e) => {
        let value = e.target.value
        let error = true
        if (value < 100 && value > 0) {
            error = true
        } else {
            error = false
        }
        setNewRate({ value, error })
    }

    const newTextChangeHandler = (e) => {
        let value = e.target.value
        let flag = true
        if (value.length < 50) {
            flag = false
        } else {
            flag = true
        }
        setNewText({ value, error: flag })
    }

    const onPaginationHandler = (index) => {
        setPagination(index)
        setRequest(true)
    }

    useEffect(() => {
        if (request)
            getTotalBillRate()
    }, [request])

    return (
        <div className="px-40 py-30">
            <ToastContainer />
            <Modal show={modalFlag} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>New </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <Form.Group className="col-md-12">
                            <Form.Label>Rate (%)</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                value={newRate.value}
                                onChange={newRateChangeHandler}
                                isInvalid={!newRate.error}
                                style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid rate between 1 ~ 100.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                    <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={newText.value}
                            onChange={newTextChangeHandler}
                            isInvalid={!newText.error}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please Provide more than 50 letters
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={hideModal} className="px-20 py-10 rounded-8 border-blue" >
                        Close
                    </button>
                    <button onClick={insertNewBillRate} className="px-20 py-10 bg-blue-1 ml-20 rounded-8 text-white -dark-1">
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
            <div className="col-4 py-20">
                <h1 className="text-30 lh-14 fw-600">Bill Rate Manger</h1>
            </div>
            <div className={"d-flex justify-end py-20" + (loading ? " disable" : "")}  >
                <div className="">
                    <button onClick={onNewHandler} className="bg-blue-1 text-white text-15 rounded-8 px-20 py-5">
                        <i className="icon-plus text-15" /> New</button>
                </div>
            </div>
            <table className="border-blue col-12 table-3" style={{ borderRadius: '0px' }}>
                <thead className="bg-blue-1 text-white text-center text-15 ">
                    <tr>
                        <th className="border-blue" style={{ borderRadius: '0px' }}>#</th>
                        <th className="border-blue">Rate</th>
                        <th className="border-blue">Comment</th>
                        <th className="border-blue" style={{ borderRadius: '0px' }}>Create At</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        billRate.map((rate, rateId) => (
                            <tr key={rateId} >
                                <td className="border-blue col-1 text-center">
                                    {rateId + 1 + (pagination - 1) * pageSize}
                                </td>
                                <td className="border-blue col-1 text-center">
                                    {rate.rate} %
                                </td>
                                <td className="border-blue col-5 text-center">
                                    {rate.comment}
                                </td>
                                <td className="border-blue col-3 text-center">
                                    {getDate(rate.create_at)}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
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
    )
}

export default index