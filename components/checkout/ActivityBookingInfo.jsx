import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { activityOperation } from "../../features/activity/activity";

const ActivityBookingInfo = ({ activitiyBookingData }) => {
    const dispatch = useDispatch()
    const [bookData, setBookData] = useState(null)

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
        let curDate = moment(date)
        return curDate.format('YYYY-MM-DD')
    }

    const getComment = (comment) => {
        let replace = comment.replace('\n', '/')
        let tokens = replace.split('/')
        return (
            <ul>
                {tokens?.map((token, id) => (
                    token != "" ? (
                        <li key={id} className="ml-30" style={{ listStyle: 'disc' }}>
                            {token}
                        </li>
                    ) : null
                ))}
            </ul>
        )
    }

    const printVoucher = () => {
        fetch(bookData?.voucher)
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
        if (activitiyBookingData) {
            setBookData(activitiyBookingData)
            dispatch(activityOperation({ type: 'activityReserve', data: [] }))
        }

    }, [activitiyBookingData])

    return (
        <div className="border-type-1 rounded-8 px-50 py-35 mt-40">
            <div className="d-flex justify-between item-center">
                <h5 >Activity Booking Information</h5>
                <button onClick={printVoucher} className="rounded-8 button mr-10 h-60 px-24 -dark-1 bg-blue-1 text-white text-18 mt-20 ">
                    Print/Download Voucher
                </button>
            </div>

            <table className="col-lg-12 mt-20 border-blue">
                <thead className="bg-light-2" >
                    <tr className="bg-blue-1 text-white border-blue">
                        <th className="text-left border-blue v-top"><p className="ml-10 text-white">Activitiy Infomation</p> </th>
                        <th className="text-left border-blue v-top"><p className="ml-10 text-white">Other Information</p> </th>
                        <th className="text-left border-blue v-top"><p className="px-10 text-white">Comment</p></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bookData?.activities?.map((activity, aId) => (
                            <tr key={aId} className="border-blue">
                                <td className="col-4 px-10 py-10 text-blue-1 fw-500 border-blue v-top">
                                    <div className="fw-800 text-blue-1">
                                        {activity.name + " ( " + activity.type + " )"}+ {activity.modality.name}
                                    </div>
                                    {
                                        activity?.questions?.length > 0 ? (
                                            <div className="mt-10">
                                                <div className="fw-500 text-black">Questions / Answers</div>
                                                <ul className="mt-10">
                                                    {
                                                        activity?.questions?.map((item, id) => (
                                                            <Fragment key={id}>
                                                                {
                                                                    item?.question?.text ? (
                                                                        <>
                                                                            <li className="text-black text-16  fw-500">{item?.question?.text}</li>
                                                                            <li className="text-black mt-5">{item?.answer}</li>
                                                                        </>
                                                                    ) : null
                                                                }
                                                            </Fragment>

                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        ) : null
                                    }

                                </td>
                                <td className="col-2 px-10 py-10 text-black text-15 border-blue v-top">
                                    <div className="text-black fw-500 d-flex justify-between">
                                        <span>Total Amount</span>
                                        <span>{bookData?.currency} {decimalAdjust('floor', bookData?.paidAmount, -2)}</span>
                                    </div>
                                    <div className="mt-10">
                                        <div className="text-black fw-500">Date of Service</div>
                                        <div className="row ">
                                            <div className="col-3 fw-500">
                                                From
                                            </div>
                                            <div className="col-9">
                                                {getDateTime(activity.dateFrom)}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3 fw-500">
                                                To
                                            </div>
                                            <div className="col-9">
                                                {getDateTime(activity.dateTo)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <div className="text-black fw-500">Pax Distribution</div>
                                        {
                                            activity.paxes?.map((pax, paxId) => (
                                                <p className="text-black text-16" key={paxId}>{pax.name + " " + pax.surname + " ( " + pax.age + " years old )"}</p>
                                            ))
                                        }
                                    </div>
                                    <div className="text-green-2 mt-10">
                                        <span className="fw-700">Free Cancellation</span>
                                        {
                                            activity?.cancellationPolicies ? (
                                                <span className="fw-500"> Util {getDateTime(activity?.cancellationPolicies[0]?.dateFrom)}</span>
                                            ) : null
                                        }
                                    </div>
                                </td>
                                <td className="col-6 px-10 py-10 text-black text-15 border-blue v-top">
                                    {
                                        getComment(activity.comments[0].text)
                                    }
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    )
}

export default ActivityBookingInfo