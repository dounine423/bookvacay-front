import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { hotelOperation } from "../../features/hotels/hotelSlice";

const HotelBookingInfo = ({ hotelBookingData }) => {
    const dispatch = useDispatch()
    const { reference, creationDate, status, hotel, invoiceCompany, voucher, c_currency, hotelReserve } = hotelBookingData
    const componentRef = useRef([])
    const [phones, setPhones] = useState([])
    const [category, setCategory] = useState(null)
    const [address, setAddress] = useState(null)
    const [guest, setGuest] = useState([])
    const [children, setChild] = useState()
    const [adults, setAdult] = useState()
    const [extra, setExtra] = useState([])
    const [paxes, setPaxes] = useState([])
    const [accommodation, setAccommodation] = useState(null)
    const [hReserve, setHReserve] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)

    const getDateTime = (date) => {
        return moment(date).format('YYYY-MM-DD');
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
        const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
        return Number(`${newMagnitude}e${+newExponent + exp}`);
    }


    const datediff = (firstDate, secondDate) => {
        return Math.round((new Date(secondDate) - new Date(firstDate)) / 1000 / 60 / 60 / 24);
    }

    const getComment = (str) => {
        let tokens = str.split('. ')
        return (
            <ul>
                {tokens.map((token, id) => (
                    <li key={id} className="ml-30" style={{ listStyle: 'disc' }}>
                        {token}
                    </li>
                ))}
            </ul>
        )
    }

    const getPhoneType = (str) => {
        let first = str[0]
        let rest = str.slice(1, str.length)
        rest = rest.toLowerCase()
        return first + rest
    }

    const getChoice = (rate) => {
        const { cancellationPolicies, boardCode, boardName, paymentType } = rate
        let board = boardName
        if (boardCode == 'HB')
            board = 'Breakfast & dinner included'
        if (boardCode == 'FB')
            board = 'Breakfast, lunch & dinner included'
        return (
            <div className="mt-10 text-15 text-black">
                <p className="text-green-2">{board}</p>
                {
                    cancellationPolicies ? (
                        <span className="text-green-2 fw-500"><span className="fw-700">Free Cancellation</span> until {getDateTime(cancellationPolicies[0].from)}</span>
                    ) : null
                }
            </div>
        )
    }

    const getPaxes = (roomId) => {
        if (guest.length > 0) {
            return (
                <div className="text-black text-15">
                    {
                        guest[roomId].map((rate, rateId) => (
                            <div key={rateId}>
                                <p className="text-15 text-green-2 fw-700">{rate.length > 1 ? "Room " + (rateId + 1) : null}</p>
                                <p className="text-15 text-black fw-600"> {adults > 1 ? "Adults" : "Adult"}</p>
                                {
                                    rate.slice(0, adults).map((pax, paxId) => (
                                        <p key={paxId + "ad"} className="text-15 text-black fw-500">{pax[0].value + " " + pax[1].value}</p>
                                    ))
                                }
                                {
                                    children > 0 ? (
                                        <>
                                            <p className="text-black text-15 fw-600">{children > 1 ? "Children" : "Child"}</p>
                                            {
                                                rate.slice(adults, (adults + children)).map((pax, paxId) => (
                                                    <p key={paxId + "ch"} className="text-15 text-black fw-500">{pax[0].value + " " + pax[1].value} ({paxes[paxId].age} years old) </p>
                                                ))
                                            }
                                        </>

                                    ) : null
                                }
                            </div>
                        ))
                    }
                </div >
            )
        }
    }

    const getFacility = (facility) => {
        const { name, number, facilityCode, amount, currency, indFee } = facility
        switch (facilityCode) {
            case 295:
                if (number && number > 0)
                    return (
                        <>Room size <span className="fw-500">{number} m<sup>2</sup></span></>
                    )
            case 298:
                if (number)
                    return (
                        <>{name} <span className="fw-500"> {number} </span></>
                    )
        }

        if (facilityCode != 295 && facilityCode != 298) {
            if (indFee)
                return (
                    <> <span className="fw-500">{name} * {amount ? (" ( " + currency + " " + amount + " ) ") : ""}</span>  </>
                )
            else
                return (
                    <>{name}</>
                )
        }

    }

    const PrintVoucher = () => {
        fetch(voucher)
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
        dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
        setPhones([...hotelReserve.phones])
        setCategory(hotelReserve.category)
        setAddress(hotelReserve.address)
        setGuest([...hotelReserve.guestInfo])
        setAdult(hotelReserve.adults)
        setChild(hotelReserve.children)
        setAccommodation(hotelReserve.accommodation)
        setExtra([...hotelReserve.extra])
        setPaxes([...hotelReserve.paxes])
        setHReserve([...hotelReserve.reserveData])
        setTotalAmount(hotelReserve.totalAmount)
    }, [])


    return (
        <>
            <div className="d-flex justify-end">
                <button onClick={PrintVoucher} className="rounded-8 button mr-10 h-60 px-24 -dark-1 bg-blue-1 text-white text-18 mt-20 ">
                    Print/Download Voucher
                </button>
            </div>
            <div className="border-type-1 rounded-8 px-50 py-35 mt-40" ref={componentRef}>
                <div className="row">
                    <div className="col-lg-3 col-md-6">
                        <div className="text-18 lh-12 fw-500">Reference</div>
                        <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                            {reference}
                        </div>
                    </div>
                    {/* End .col */}
                    <div className="col-lg-3 col-md-6">
                        <div className="text-18 lh-12 fw-500">Create Date</div>
                        <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                            {getDateTime(creationDate)}
                        </div>
                    </div>
                    {/* End .col */}
                    <div className="col-lg-3 col-md-6">
                        <div className="text-18 lh-12 fw-500">Total</div>
                        <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                            {c_currency + " " + decimalAdjust('floor', totalAmount, -2)}
                        </div>
                    </div>
                    {/* End .col */}
                    <div className="col-lg-3 col-md-6">
                        <div className="text-18 lh-12 fw-500">Status</div>
                        <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                            {getPhoneType(status)}
                        </div>
                    </div>
                    {/* End .col */}
                </div>
                <div className="d-flex justify-between mt-10">
                    <div style={{ alignItems: 'end' }}>
                        <div className="mt-10 d-flex">
                            <div className="text-18 text-black fw-600">
                                <span className="text-18 fw-500 mr-10">
                                    {accommodation}
                                </span>
                                {hotel.name}
                            </div>
                            <div className="ml-20">
                                {
                                    Array(category).fill().map((_, i) => (
                                        <i key={i} className="icon-star text-20 text-yellow-1" />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="d-flex" >
                            <i className="icon-location-2 mr-10 text-blue text-20" />
                            <div className="text-blue-1 text-15">{address}</div>
                        </div>
                    </div>
                    <div className="text-black mt-20 v-middle">
                        <div>Check-in <span className="ml-20">{getDateTime(hotel.checkIn)}</span>  </div>
                        <div>Check-out <span className="ml-20">{getDateTime(hotel.checkOut)}</span>  </div>
                        <div>Total length of stay <span className="ml-20">{datediff(hotel.checkIn, hotel.checkOut)} day()</span></div>
                    </div>
                </div>
                <table className="col-lg-12 mt-10 border-blue">
                    <thead className="bg-light-2" >
                        <tr className="bg-blue-1 text-white border-blue">
                            <th className="text-left border-blue"><p className="ml-10 text-white">Room Name</p> </th>
                            <th className="text-left border-blue"><p className="ml-10 text-white">Your Choice</p> </th>
                            <th className="text-left border-blue"><p className="ml-10 text-white">Paxes</p> </th>
                            <th className="text-left border-blue"><p className="px-10 text-white">Comment</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            hotel.rooms.map((roomData, roomId) => (
                                <tr key={roomId} className="border-blue">
                                    <td className="col-4 px-10 py-10 border-blue v-top">
                                        <p className="text-blue-1 fw-500">{roomData.rates[0].rooms + " * " + roomData.name}</p>
                                        {
                                            hReserve[roomId]?.facility?.map((facility, hId) => (
                                                <span key={hId} className="mr-5" style={{ display: 'inline-block' }}>
                                                    <i className="icon-check text-10 mr-5" style={{ color: "green" }} />
                                                    <span className="ml-10">{getFacility(facility)}</span>
                                                </span>
                                            ))
                                        }
                                    </td>
                                    <td className="col-2 px-10 py-10 text-blue-1 fw-500 border-blue v-top">
                                        {
                                            getChoice(roomData.rates[0])
                                        }
                                    </td>
                                    <td className="col-2 px-10 py-10 text-blue-1 fw-500 border-blue v-top">
                                        {
                                            getPaxes(roomId)
                                        }
                                    </td>
                                    <td className="col-4 px-10 py-10 text-black border-blue v-top">
                                        {getComment(roomData.rates[0].rateComments)}
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
                <div className="row mt-20 mb-20">
                    <div className="col-lg-6 col-sm-12 mt-10">
                        <div className=" px-20 py-10 bg-blue-2 rounded-8">
                            <p className="text-blue-1 text-18 fw-600">Contact Information</p>
                            {
                                phones?.map((phone, phoneId) => (
                                    <div key={phoneId} className="d-flex justify-between mt-10">
                                        <span className="fw-500 text-green-2"> {phone.phoneType}</span>
                                        <span className="fw-800">{phone.phoneNumber}</span>
                                    </div>
                                ))
                            }
                            <p className="text-15 mt-20">You are encouraged to contact the above hotel and personally confirm that the booking was registered on their system</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 mt-10">
                        <div className="px-20 py-10 bg-blue-2 rounded-8 text-black text-15">
                            <p className="text-blue-1 text-18 fw-600">Invoice Information</p>
                            <div className="  d-flex justify-between mt-10">
                                <span className="text-green-2 fw-500">Company</span>
                                <span className="text-black fw-800">{invoiceCompany.company}</span>
                            </div>
                            <div className="  d-flex justify-between mt-10">
                                <span className="text-green-2 fw-500">RegistrationNumber</span>
                                <span className="text-black fw-800"> {invoiceCompany.registrationNumber}</span>
                            </div>
                            <p className="text-15 mt-20">Payable through {hotel?.supplier?.name}, acting as agent for the service operating company, details of which can be provided upon request. VAT: {hotel?.supplier?.vatNumber} Reference: {reference}</p>
                        </div>
                        {
                            extra.length > 0 ? (
                                <div className="px-20 py-10 bg-blue-2 rounded-8 text-black text-15 mt-20">
                                    <p className="text-blue-1 text-18 fw-600">Extra Cost</p>
                                    <div style={{ columnCount: 2 }}>
                                        {
                                            extra.map((facility, fId) => (
                                                <div key={fId} className="mt-5">
                                                    <span className="fw-500 text-green-2 mr-20">{facility.name}</span>
                                                    <span className="text-green-2 fw-500">{facility.amount ? (facility.currency + " " + facility.amount) : ""}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </div >
        </>

    )
}

export default HotelBookingInfo