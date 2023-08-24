import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { PaginationControl } from "react-bootstrap-pagination-control";
import moment from "moment";
import { Modal, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API } from '../../../pages/api/api'
import { adminMarkUpAction } from "../../../features/admin/adminMarkUp"

const MarkUp = () => {

    const dispatch = useDispatch()
    const { totalMarkUp, curType, mPagination, mRequest } = useSelector(state => state.adminMarkUp)
    const pageSize = 5
    const options = [
        "All",
        "Hotel",
        "Activity"
    ]

    const [comment, setComment] = useState({ value: "", error: true })
    const [activeType, setActiveType] = useState(0)
    const [curRate, setCurRate] = useState({ value: "", error: true })
    const [type, setType] = useState(curType)
    const [total, setTotal] = useState(0)
    const [markUp, setMarkUp] = useState([])
    const [pagination, setPagination] = useState(mPagination)
    const [request, setRequest] = useState(mRequest)
    const [loading, setLoading] = useState(false)
    const [modalFlag, setMFlag] = useState(false)

    const getMarkUpData = async () => {
        setLoading(true)
        let req = {
            type,
            limit: pageSize,
            offset: pageSize * (pagination - 1)
        }
        const { data } = await API.post('/getMarkUpByAdmin', req)
        console.log(data)
        if (data.success) {
            setMarkUp([...data.result.list])
            setTotal(data.result.total)
            dispatch(adminMarkUpAction({ type: 'totalMarkUp', data: data.result }))
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

    const onNewHandler = () => {
        setMFlag(true)
    }

    const getDate = (date) => {
        let curDate = moment.utc(date).toDate()
        return moment(curDate).format('D/M/YYYY HH:mm:ss')
    }

    const onPaginationHandler = (page) => {
        setPagination(page)
        setRequest(true)
    }

    const getType = (type) => {
        switch (type) {
            case 1:
                return "Hotel"
            case 2:
                return "Activity"
            default:
                return ""
        }
    }

    const onTypeChangeHandler = (e) => {
        let index = e.target.selectedIndex
        setType(index)
        setPagination(1)
        setRequest(true)
    }

    const onNewTypeHandler = (e) => {
        let index = e.target.selectedIndex
        setActiveType(index)
    }

    const onNewRateHandler = (e) => {
        let value = e.target.value
        let flag
        if (value > 0 && value < 100) {
            flag = true
        } else {
            flag = false
        }
        setCurRate({ value, error: flag })
    }

    const onNewCommentHandler = (e) => {
        let value = e.target.value
        let flag
        if (value.length < 50)
            flag = false
        else
            flag = true
        setComment({ value, error: flag })
    }

    const hideModal = () => {
        setMFlag(false)
    }

    const onSaveBtnHandler = () => {
        if (checkFormData()) {
            onNewRateSave()
            setMFlag(false)
        }
    }

    const checkFormData = () => {
        if (comment.error && comment.value != "" && curRate.error && curRate.value != "")
            return true
        else
            return false
    }

    const onNewRateSave = async () => {
        let params = {
            type: (activeType + 1),
            rate: curRate.value,
            comment: comment.value
        }
        const { data } = await API.post('/insertNewMarkUpByAdmin', params)
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
            setComment({ value: "", error: true })
            setCurRate({ value: "", error: true })
            setType(0)
            setActiveType(0)
            setTotal(data.result.total)
            setMarkUp([...data.result.list])
            setPagination(1)
            dispatch(adminMarkUpAction({ type: 'totalMarkUp', data: data.result }))

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
        console.log(getDate('Wed, 21 Jun 2023 09:55:10 GMT'))
        if (request) {
            getMarkUpData()
        } else {
            // setMarkUp([...totalMarkUp?.list])
            // setTotal(totalMarkUp?.total)
        }
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
                        <Form.Group className="col-md-6">
                            <Form.Label>Type</Form.Label>
                            <select className="form-control" onChange={onNewTypeHandler}>
                                {
                                    options?.slice(1)?.map((option, optionId) => (
                                        <option key={optionId}>{option}</option>
                                    ))
                                }
                            </select>
                        </Form.Group>
                        <Form.Group className="col-md-6">
                            <Form.Label>Rate (%)</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                value={curRate.value}
                                onChange={onNewRateHandler}
                                isInvalid={!curRate.error}
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
                            value={comment.value}
                            onChange={onNewCommentHandler}
                            isInvalid={!comment.error}
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
                    <button onClick={onSaveBtnHandler} className="px-20 py-10 bg-blue-1 ml-20 rounded-8 text-white -dark-1">
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
            <div className="col-4 py-20">
                <h1 className="text-30 lh-14 fw-600">MarkUp Manger</h1>
            </div>
            <div className={"d-flex justify-end py-20" + (loading ? " disable" : "")}  >
                <div className="">
                    <button onClick={onNewHandler} className="bg-blue-1 text-white text-15 rounded-8 px-20 py-5"><i className="icon-plus text-15" /> New</button>
                </div>
                <div className="ml-20">
                    <select className="form-control rounded-8" onChange={onTypeChangeHandler}>
                        {
                            options?.map((item, typeId) => (
                                <option key={typeId}>{item}</option>
                            ))
                        }
                    </select>
                </div>

            </div>
            <table className="border-blue col-12 table-3" style={{ borderRadius: '0px' }}>
                <thead className="bg-blue-1 text-white text-center text-15 ">
                    <tr>
                        <th className="border-blue" style={{ borderRadius: '0px' }}>#</th>
                        <th className="border-blue">Type</th>
                        <th className="border-blue">Rate</th>
                        <th className="border-blue">Comment</th>
                        <th className="border-blue" style={{ borderRadius: '0px' }}>Create At</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        markUp.map((rate, rateId) => (
                            <tr key={rateId} >
                                <td className="border-blue col-1 text-center">
                                    {rateId + 1 + (pagination - 1) * pageSize}
                                </td>
                                <td className="border-blue col-1 text-center">
                                    {getType(rate.type)}
                                </td>
                                <td className="border-blue col-1 text-center">
                                    {rate.rate} %
                                </td>
                                <td className="border-blue col-5 text-center">
                                    {rate.comment}
                                </td>
                                <td className="border-blue col-3 text-center">
                                    {getDate(rate.update)}
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
export default MarkUp