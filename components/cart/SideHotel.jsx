import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from "next/image";
import moment from 'moment';
import { hotelOperation } from '../../features/hotels/hotelSlice';

const SideHotel = () => {
    const dispatch = useDispatch()
    const { currency } = useSelector(state => state.region)
    const { hotelReserve } = useSelector(state => state.hotel)
    const [moreFlag, setMoreFlag] = useState(true)

    const onShowMore = () => {
        setMoreFlag(!moreFlag)
    }

    const parseOption = (str) => {
        let temp = str.split(/[( )]/g)
        return parseInt(temp[0])
    }

    const onChangeRoomCnt = (roomId, roomCnt) => {
        let rooms = parseOption(roomCnt)
        let tempRooms = JSON.parse(JSON.stringify(hotelReserve?.reserveData))
        tempRooms[roomId].roomCnt = rooms
        if (rooms == 0) {
            tempRooms.splice(roomId, 1)
            if (tempRooms.length == 0) {
                dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
                return
            }
        }
        let tempHotel = {
            ...hotelReserve,
            reserveData: tempRooms,
            totalAmount: getRoomsTotalAmount(tempRooms)
        }
        dispatch(hotelOperation({ type: 'hotelReserve', data: tempHotel }))
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

    const getDateTime = (date) => {
        return moment(date).format("MMM D Y ");
    }

    const optionStr = (roomCnt, price) => {
        let ret_str = roomCnt
        for (let i = 0; i < 7; i++)
            ret_str += String.fromCharCode(160)
        ret_str += "(" + currency + " " + decimalAdjust('floor', (roomCnt * price), -2) + ")"
        return ret_str
    }

    const getBoard = (boardName, boardCode) => {
        let board = boardName;
        if (boardCode == 'HB')
            board = 'Breakfast & dinner included'
        if (boardCode == 'FB')
            board = 'Breakfast, lunch & dinner included'
        return board
    }

    const getRoomsTotalAmount = (rooms) => {
        let total = 0
        rooms.map((item) => {
            total += item.price * item.roomCnt
        })
        return decimalAdjust('floor', total, -2)

    }

    useEffect(() => {
      
    }, [])

    return (
        <div>
            <div
                className="col-lg-12 mt-15 mb-3 px-10"
                data-aos-delay={100}
                style={{ paddingRight: "5px", paddingLeft: "5px" }}
            >
                <div className="row " >
                    <div className="activityCard__image col-sm-5 col-lg-5">
                        <Image
                            width={300}
                            height={300}
                            className="js-lazy"
                            src={hotelReserve?.image}
                            alt="image"
                        />
                    </div>
                    <div className="activityCard__content col-sm-7  col-lg-7 position-relative" >
                        <label className='mb-1 fw-500 text-16'> {getDateTime(hotelReserve?.inDate)} - {getDateTime(hotelReserve?.outDate)}</label>
                        <h4 className="activityCard__title lh-16  text-dark-1">
                            <span className=' fw-500 text-18'>{hotelReserve?.name}</span>
                            <br />
                            <span className="text-light-1 text-16">{hotelReserve?.address}</span>
                        </h4>
                        <div className='d-flex justify-between'>
                            <p className='text-18'>Total Amount</p>
                            <p className='fw-500 text-18 text-black'>{currency + " " + decimalAdjust('floor', hotelReserve?.totalAmount, -2)}</p>
                        </div>
                    </div >
                </div>
            </div >
            {
                moreFlag ? (
                    <div className='px-30 mt-10 '>
                        {
                            hotelReserve?.reserveData?.map((room, roomId) => (
                                <div key={roomId} className='bg-blue-2 py-10 px-10 mt-10 position-relative' style={{ borderRadius: '7px' }} >
                                    <p key={"name-"} className='text-18 fw-500 text-black'>{room.roomName}</p>
                                    <p className='text-18 text-black fw-500'>{currency + " " + decimalAdjust('floor', room.price, -2)}</p>
                                    <p key={"board-"} className='text-16 text-green-2 fw-400'>{getBoard(room.boardName, room.boardCode)}</p>
                                    {
                                        room?.promotions?.map((item, index) => (
                                            <p key={"promotion-" + index} className='text-16 text-black' >{item.name}</p>
                                        ))
                                    }
                                    {
                                        room?.cancellationPolicies ? (
                                            <p className='text-16 text-green-2 fw-100'><span className="fw-600">Free</span>  Cancellation until {getDateTime(room.cancellationPolicies[0].from)}</p>
                                        ) : null
                                    }
                                    <div className='px-15 col-lg-2' style={{ position: "absolute", top: '5px', right: '-3px', left: "auto" }}>
                                        <select className='mt-10 form-control' defaultValue={optionStr(room.roomCnt, room.price)} onChange={(e) => onChangeRoomCnt(roomId, e.target.value)}>
                                            <option key="first">{optionStr(0, room.price)}</option>
                                            {
                                                Array(room.allotment / 1).fill().map((_, i) => (
                                                    <option key={i}>{optionStr((i + 1), room.price)}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : null
            }
        </div >
    )
}

export default SideHotel;