import { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import moment from "moment"
import { Form } from "react-bootstrap"
import BookingDetails from "./sidebar/HotelBookingDetails"
import Hotel from './sidebar/Hotel'
import { hotelOperation } from "../../features/hotels/hotelSlice"

const HotelBook = ({ nextFunction }) => {
    const dispatch = useDispatch()
    const { hotelReserve } = useSelector(state => state.hotel)
    const { holder_info } = useSelector(state => state.holder)
    const { reserveData, adults, children, paxes } = hotelReserve
    const [guestName, setGName] = useState(null)
    const [validated, setValidated] = useState(false)

    const getDateTime = (date) => {
        return moment(date).format('MMM D Y');
    }

    const onGuestNameHandler = (roomId, rateId, paxId, type, value) => {
        let nameReg = /^[a-zA-Z]+$/;
        let temp = [...guestName]
        temp[roomId][rateId][paxId][type].value = value
        temp[roomId][rateId][paxId][type].error = nameReg.test(value)
        setValidated(nameReg.test(value))
        setGName([...temp])
    }

    const renderRate = (rate, roomId, rateId) => {
        const { roomName, cancellationPolicies, boardName, promotions, boardCode } = rate
        let board = boardName
        if (boardCode == 'HB')
            board = 'Breakfast & dinner included'
        if (boardCode == 'FB')
            board = 'Breakfast, lunch & dinner included'
        if (guestName != null)
            return (
                <div key={rateId + "*" + roomId}>
                    <div className="d-flex justify-between">
                        <p className='text-20 fw-500 text-black'>{roomName}</p>
                        <div className="text-18 fw-300 text-black">
                            <span className="px-5">Adults : {adults}</span>
                            <span className="px-5">Children : {children}</span>
                        </div>
                    </div>

                    <p key={"board-"} className='text-18 text-green-2'>{board}</p>
                    {
                        promotions?.map((item, index) => (
                            <p key={"promotion-" + index} className='text-18 text-black' >{item.name}</p>
                        ))
                    }
                    {
                        cancellationPolicies ? (
                            <p key={"c-policy"} className='text-18 text-green-2 fw-100'><span className="fw-600">Free</span>  Cancellation until {getDateTime(cancellationPolicies[0].from)}</p>
                        ) : null
                    }
                    <div className="row mt-10">
                        <p key={roomId + rateId + "adult-des"}>Guest Name(s) (Adult)</p>
                        {
                            Array(adults).fill().map((_, paxId) => (
                                <Fragment key={paxId}>
                                    <Form.Group key={roomId + rateId + paxId + "ad-f"} className="col-md-6" controlId="formName">
                                        <Form.Label>Frist Name *</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={guestName[roomId][rateId][paxId][0].value}
                                            onChange={(e) => onGuestNameHandler(roomId, rateId, paxId, 0, e.target.value.trim())}
                                            isInvalid={!guestName[roomId][rateId][paxId][0].error}
                                            className="bg-white"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid first name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group key={roomId + rateId + paxId + "ad-l"} className="col-md-6" controlId="formName">
                                        <Form.Label>Last Name *</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={guestName[roomId][rateId][paxId][1].value}
                                            onChange={(e) => onGuestNameHandler(roomId, rateId, paxId, 1, e.target.value.trim())}
                                            isInvalid={!guestName[roomId][rateId][paxId][1].error}
                                            className="bg-white"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a last name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Fragment>
                            ))
                        }

                        {
                            children > 0 ? (<p key={roomId + rateId + "child-des"}>Guest Name(s)(Children)</p>) : null
                        }
                        {
                            Array(children).fill().map((_, paxId) => (
                                <Fragment key={paxId}>
                                    <Form.Group key={roomId + rateId + paxId + "ch-f"} className="col-md-5" controlId="formName">
                                        <Form.Label>Frist Name *</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={guestName[roomId][rateId][(adults + paxId)][0].value}
                                            onChange={(e) => onGuestNameHandler(roomId, rateId, (adults + paxId), 0, e.target.value.trim())}
                                            isInvalid={!guestName[roomId][rateId][(adults + paxId)][0].error}
                                            className="bg-white"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid first name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group key={roomId + rateId + paxId + "ch-l"} className="col-md-5" controlId="formName">
                                        <Form.Label>Last Name *</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={guestName[roomId][rateId][(adults + paxId)][1].value}
                                            onChange={(e) => onGuestNameHandler(roomId, rateId, (adults + paxId), 1, e.target.value.trim())}
                                            isInvalid={!guestName[roomId][rateId][(adults + paxId)][1].error}
                                            className="bg-white"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a last name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="col-md-2">
                                        <Form.Label>Age *</Form.Label>
                                        <select className="form-control">
                                            <option key={paxId}>{paxes[paxId].age}</option>
                                        </select>
                                    </Form.Group>
                                </Fragment>
                            ))
                        }
                    </div >
                </div>)
    }

    const checkError = () => {
        let result = 1
        guestName.map((room) => {
            room.map((rates) => {
                rates.map((paxes) => {
                    paxes.map((pax) => {
                        if (!pax.error) {
                            result *= 0
                        }
                    })
                })
            })
        })
        return result
    }

    const saveGuest = () => {
        let temp = []
        hotelReserve?.reserveData.map((item, id) => {
            let guest = []
            let paxInfo = []
            guestName[id].map((room, roomId) => {
                let adultPax = []
                let childPax = []
                let roomPax = {}
                room.slice(0, adults).map((pax) => {
                    adultPax.push({ name: (pax[0].value + " " + pax[1].value) })
                    paxInfo.push(
                        {
                            roomId: (roomId + 1),
                            type: "AD",
                            name: pax[0].value,
                            surname: pax[1].value
                        }
                    )
                })
                room.slice(adults, (adults + children)).map((pax, id) => {
                    childPax.push({ name: (pax[0].value + " " + pax[1].value), age: paxes[id].age })
                    paxInfo.push({
                        roomId: (roomId + 1),
                        type: "CH",
                        name: pax[0].value,
                        surname: pax[1].value,
                        age: paxes[id].age
                    })
                })
                roomPax['adult'] = adultPax
                if (childPax.length > 0) {
                    roomPax['child'] = childPax
                }
                guest.push({ paxes: roomPax, roomId: roomId + 1 })
            })
            let data = {
                ...item,
                paxInfo,
                guest
            }
            temp.push(data)
        })
        dispatch(hotelOperation({ type: 'hotelReserve', data: { ...hotelReserve, reserveData: temp, guestInfo: guestName } }))
    }

    const onNextStep = () => {
        nextFunction()
        let flag = checkError()
        if (flag) {
            saveGuest()
        }
    }

    useEffect(() => {
        let tempGuest = []
        reserveData.map((room, roomId) => {
            let tempRoom = []
            Array(room.roomCnt / 1).fill().map((_, rateId) => {
                let tempRate = []
                let temp = []
                Array(adults).fill().map((_, paxId) => {
                    temp = []
                    if (rateId == 0 && roomId == 0 && paxId == 0 && holder_info) {
                        const { name, surname } = holder_info
                        temp.push({ value: name, error: true })
                        temp.push({ value: surname, error: true })
                    } else {
                        temp.push({ value: "", error: false })
                        temp.push({ value: "", error: false })
                    }
                    tempRate.push(temp)
                })
                Array(children).fill().map((_, i) => {
                    temp = []
                    temp.push({ value: "", error: false })
                    temp.push({ value: "", error: false })
                    tempRate.push(temp)
                })
                tempRoom.push(tempRate)
            })
            tempGuest.push(tempRoom)
        })
        setGName([...tempGuest])
    }, [])

    return (
        <div className="row">
            <div className="col-xl-5 col-lg-4 mt-30">
                <div className="booking-sidebar">
                    <BookingDetails hotelData={hotelReserve} />
                </div>
            </div>
            <div className="col-xl-7 col-lg-8 mt-30">
                <Hotel hotelData={hotelReserve} />
                <Form noValidate validated={validated} className="rounded-8 bg-blue-2 px-30 py-20 mt-20">
                    <div>

                    </div>
                    {
                        reserveData.map((room, roomId) => (
                            Array(room.roomCnt / 1).fill().map((rate, rateId) => (
                                < div key={roomId + "-" + rateId} id={roomId + "-" + rateId} >
                                    {renderRate(room, roomId, rateId)}
                                </div>
                            ))
                        ))
                    }
                </Form >
                <div className="d-flex justify-end">
                    <button onClick={onNextStep} className="rounded-8 button h-60 px-24 -dark-1 bg-blue-1 text-white text-18 mt-20 ">
                        Next
                        <i className="icon-arrow-top-right text-14 px-10"></i>
                    </button>
                </div>
            </div >
        </div>
    )
}

export default HotelBook