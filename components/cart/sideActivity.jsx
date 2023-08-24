import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment'
import Image from "next/image";
import { activityOperation } from "../../features/activity/activity";

const SideActivity = () => {
    const dispatch = useDispatch()
    const { currency } = useSelector(state => state.region)
    const { activityReserve } = useSelector(state => state.activity)
    const [moreFlags, setMoreFlags] = useState([])

    const onShowMore = (actiId) => {
        let tempFlags = [...moreFlags]
        tempFlags[actiId] = !tempFlags[actiId]
        setMoreFlags([...tempFlags])
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

    const getTotalAmount = (list) => {
        let total = 0
        list.modality.map((modality) => {
            modality.rates.map((rate) => {
                total += rate.amount
            })
        })
        return decimalAdjust('floor', total, -2)
    }


    const onRemoveModality = (aId, mId, rId) => {
        let tempList = JSON.parse(JSON.stringify(activityReserve))
        tempList[aId].modality[mId].rates.splice(rId, 1)
        tempList[aId].totalAmount = getTotalAmount(tempList[aId])
        if (tempList[aId].modality[mId].rates.length == 0) {
            tempList[aId].modality.splice(mId, 1)
            if (tempList[aId].modality.length == 0) {
                tempList.splice(aId, 1)
            }
        }
        dispatch(activityOperation({ type: 'activityReserve', data: tempList }))
    }

    const getDateTime = (date) => {
        return moment(date).format("D") + " " + moment(date).format('MMM') + " " + moment(date).format('Y');
    }

    useEffect(() => {
        let tempFlags = []
        Array(activityReserve.length).fill().map((_, i) => {
            tempFlags.push(false)
        })
        setMoreFlags(tempFlags)
    }, [])

    return (
        <>
            {
                activityReserve.map((activity, actiId) => (
                    <div key={actiId}>
                        <div
                            className="col-lg-12 mt-15"
                            data-aos="fade"
                            data-aos-delay={100}
                            style={{ paddingRight: "5px", paddingLeft: "5px" }}
                        >
                            <div className="row " >
                                <div className="activityCard__image  col-lg-5 col-sm-5">
                                    <Image
                                        width={300}
                                        height={300}
                                        className="js-lazy"
                                        src={activity.image}
                                        alt="image"
                                    />
                                </div>
                                <div className="activityCard__content  col-sm-7 col-lg-7 position-relative" >
                                    <div className="px-20">
                                        <h4 className="activityCard__title lh-16 fw-500 text-dark-1 text-18">
                                            {activity.name}
                                        </h4>
                                        <p className="text-light-1 text-18 fw-500 lh-14 mt-15">
                                            {activity.location}
                                        </p>
                                        <div className="text-18 lh-14 text-light-1 mt-15 d-flex justify-content-between " style={{ marginRight: '10px' }}>
                                            <span>TotalAmount</span>
                                            <label className="fw-500 text-black" >{currency + " " + decimalAdjust('floor', activity.totalAmount, -2)}</label>
                                        </div>
                                    </div>

                                    <div className="ml-5" style={{ position: 'absolute', top: '0px', right: '2px' }}>
                                        <button onClick={() => onShowMore(actiId)} className="button -blue-1 bg-white size-30 rounded-full shadow-2 mr-15">
                                            <i className={(moreFlags[actiId] ? "icon-minus" : "icon-plus") + " text-15"} />
                                        </button>
                                    </div>

                                </div >
                            </div>

                        </div>
                        {
                            moreFlags[actiId] ? (
                                <div className="mt-25 px-15 "
                                    data-aos="fade"
                                    data-aos-delay={100}
                                >
                                    {
                                        activity.modality.map((modality, mId) => (
                                            <div key={mId} className="col-lg-12 mt-15  px-20 bg-blue-2 rounded-8 py-10" >
                                                <div className="text-20 fw-500">{modality.name}</div>
                                                {
                                                    modality?.rates?.map((rate, rateId) => (
                                                        <div key={rateId} className="border mb-10 px-30 py-30 rounded-16 position-relative"  >
                                                            <div className="d-flex justify-between fw-500">
                                                                <span>From {getDateTime(rate.from)}</span>
                                                                <span>To {getDateTime(rate.to)}</span>
                                                                <span>Amount {currency + " " + decimalAdjust('floor', rate.amount, -2)}</span>
                                                            </div>
                                                            <div className="row justify-between">
                                                                <div className="row col-6">
                                                                    <div className="col-6">
                                                                        {rate?.sessions?.length > 0 ? (
                                                                            <span className="fw-500 text black">Sessions</span>
                                                                        ) : null}
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <ul >
                                                                            {
                                                                                rate?.sessions?.map((item, id) => (
                                                                                    <li
                                                                                        key={id}
                                                                                        className="text-black">{item.code}</li>
                                                                                ))
                                                                            }
                                                                        </ul>
                                                                    </div>

                                                                </div>
                                                                <div className="row col-6">
                                                                    <div className="col-6">
                                                                        {
                                                                            rate?.languages?.length > 0 ? (
                                                                                <span className="text-black fw-500">Languages</span>
                                                                            ) : null
                                                                        }
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <ul >
                                                                            {
                                                                                rate?.languages?.map((item, id) => (
                                                                                    <li key={id}>
                                                                                        {item.description}
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ul>
                                                                    </div>

                                                                </div>
                                                                <div className="col-6"></div>
                                                            </div>
                                                            <div style={{ position: "absolute", top: '0px', right: '-3px', left: "auto" }}>
                                                                <button onClick={() => onRemoveModality(actiId, mId, rateId)} className="button -blue-1 bg-white size-30 rounded-full shadow-2 mr-15">
                                                                    <i className="text-15 icon-trash" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                ))
            }
        </>
    )
}

export default SideActivity