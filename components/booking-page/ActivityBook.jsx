import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import moment from "moment"
import { Form } from "react-bootstrap"
import ActivityBookingDetail from "./sidebar/ActivityBookingDetail"
import { activityOperation } from "../../features/activity/activity"

const ActivityBook = ({ nextFunction }) => {
    const dispatch = useDispatch()
    const { activityReserve } = useSelector(state => state.activity)
    const [reserve, setReserve] = useState([])
    const { holder_info } = useSelector(state => state.holder)

    const getDateTime = (date) => {
        return moment(date).format('ddd D MMM')
    }

    const onGuestNameHandler = (aId, mId, rateId, paxId, e) => {
        let nameReg = /^[a-zA-Z]+$/;
        let temp = [...reserve]
        temp[aId].modality[mId].rates[rateId].paxes[paxId].name = e
        temp[aId].modality[mId].rates[rateId].paxes[paxId].nameF = nameReg.test(e)
        setReserve([...temp])
    }

    const onGuestSurNameHandler = (aId, mId, rateId, paxId, e) => {
        let nameReg = /^[a-zA-Z]+$/;
        let temp = [...reserve]
        temp[aId].modality[mId].rates[rateId].paxes[paxId].surname = e
        temp[aId].modality[mId].rates[rateId].paxes[paxId].surnameF = nameReg.test(e)
        setReserve([...temp])
    }

    const onNextStep = () => {
        let flag = checkError()
        if (flag == 1) {
            nextFunction()
            saveGuest()
        }
    }

    const checkError = () => {
        let flag = 1
        reserve.map((activity) => {
            activity.modality.map((modality) => {
                modality.rates.map((rate) => {
                    rate.paxes.map((pax) => {
                        if (pax.surnameF == false)
                            flag = 0
                        if (pax.nameF == false)
                            flag = 0
                    })
                })
                modality.answers.map((ans) => {
                    if (ans.error == false)
                        flag = 0
                })
            })
        })
        return flag
    }

    const getPaxType = (paxAmounts, age) => {
        let adult = 0
        let child = 0
        paxAmounts.map((item) => {
            if (item.paxType == "CHILD")
                child = parseInt(item.ageTo)
            if (item.paxType == "ADULT")
                adult = parseInt(item.ageFrom)
        })
        if (age < adult)
            return "CHILD"
        else
            return "ADULT"
    }

    const saveGuest = () => {
        dispatch(activityOperation({ type: 'activityReserve', data: reserve }))
    }

    const onQuestionTestHandler = (aId, mId, qId, e) => {
        let temp = [...reserve]
        let error
        if (e.length == 0) {
            error = false
        } else {
            error = true
        }
        temp[aId].modality[mId].answers[qId].answer = e
        temp[aId].modality[mId].answers[qId].error = error
        setReserve([...temp])
    }

    useEffect(() => {
        const { email, phone } = holder_info
        let tempList = JSON.parse(JSON.stringify(activityReserve))
        tempList.map((activity, aId) => {
            activity.modality.map((modality, mId) => {
                let answers = []
                modality.rates.map((rate, rateId) => {
                    rate.paxes.map((item, id) => {
                        item = {
                            ...item,
                            name: "",
                            surname: "",
                            nameF: false,
                            surnameF: false,
                            type: getPaxType(rate.paxAmounts, item.age)
                        }
                        rate.paxes[id] = item
                    })
                })
                modality.questions?.map((question) => {
                    let temp = {
                        question: {
                            code: question.code
                        }
                    }
                    if (question.code == "EMAIL") {
                        temp['answer'] = email
                        temp['error'] = true
                    }
                    else if (question.code == "PHONENUMBER") {
                        temp['answer'] = phone
                        temp['error'] = true
                    }
                    else {
                        temp['answer'] = ""
                        temp['error'] = false
                    }
                    answers.push(temp)
                })
                modality.answers = answers
            })
        })
        setReserve([...tempList])
    }, [])

    return (
        <div className="row">
            <div className="col-xl-5 col-lg-4 mt-30">
                <div className="booking-sidebar">
                    <ActivityBookingDetail activtyData={activityReserve} />
                </div>
            </div>
            <div className="col-xl-7 col-lg-8 mt-30">
                {
                    reserve.map((item, id) => (
                        <div key={id} className="bg-blue-2 px-30 py-20 rounded-8 mb-20">
                            <h6 className="text-18 text-blue-1 fw-500 mb-10">{item.name}</h6 >
                            {
                                item.modality.map((modality, mId) => (
                                    <div key={mId} className="mb-10 border rounded-16 px-30 py-20">
                                        <div className="fw-700 text-black text-18 mb-10">{modality.name}</div>
                                        {
                                            modality?.rates?.map((rate, rateId) => (
                                                <div key={rateId} className="border mb-10 rounded-16 px-30 py-10">
                                                    <div className="text-black text-16 fw-500">
                                                        <span className="px-5">{getDateTime(rate.from)}</span>-
                                                        <span className="px-5">{getDateTime(rate.to)}</span>
                                                    </div>
                                                    {
                                                        rate?.paxes.map((pax, paxId) => (
                                                            <div className="row mt-10" key={paxId}>
                                                                <Form.Group className="col-md-5" controlId="formName">
                                                                    <Form.Label>Frist Name *</Form.Label>
                                                                    <Form.Control
                                                                        required
                                                                        type="text"
                                                                        value={pax.name}
                                                                        onChange={(e) => onGuestNameHandler(id, mId, rateId, paxId, e.target.value.trim())}
                                                                        isInvalid={!pax.nameF}
                                                                        className="bg-white"
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Please provide a valid first name.
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                                <Form.Group className="col-md-5" controlId="formName">
                                                                    <Form.Label>Last Name *</Form.Label>
                                                                    <Form.Control
                                                                        required
                                                                        type="text"
                                                                        value={pax.surname}
                                                                        onChange={(e) => onGuestSurNameHandler(id, mId, rateId, paxId, e.target.value.trim())}
                                                                        isInvalid={!pax.surnameF}
                                                                        className="bg-white"
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Please provide a valid last name.
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>
                                                                <Form.Group className="col-md-2" controlId="formName">
                                                                    <Form.Label>Age *</Form.Label>
                                                                    <select className="form-control bg-white">
                                                                        <option>{pax.age}</option>
                                                                    </select>
                                                                </Form.Group>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ))
                                        }
                                        {
                                            modality?.answers?.length > 0 ? (
                                                <div className="border rounded-16 mt-20 px-30 py-10">
                                                    <div className="text-18 text-black fw-500">Questions</div>
                                                    {
                                                        modality?.questions?.map((question, qId) => (
                                                            <Form.Group className="col-md-12" key={qId} controlId="formName">
                                                                <Form.Label>{question?.text} *</Form.Label>
                                                                <Form.Control
                                                                    required
                                                                    type="text"
                                                                    value={modality?.answers[qId]?.answer}
                                                                    onChange={(e) => onQuestionTestHandler(id, mId, qId, e.target.value.trim())}
                                                                    isInvalid={!modality?.answers[qId]?.error}
                                                                    className="bg-white"
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    Please provide a valid first name.
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        ))
                                                    }
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
            <div className="d-flex justify-end mt-20">
                <button
                    className={"button rounded-8 h-60 px-24 -dark-1  bg-blue-1 text-white text-18"}
                    onClick={onNextStep}
                >
                    Next <div className="icon-arrow-top-right ml-15" />
                </button>
            </div>
        </div>
    )
}

export default ActivityBook