import { useSelector } from "react-redux";
import moment from "moment";


const SideBarTotal = ({ activtyData }) => {
    const { currency } = useSelector(state => state.region)
    const { from, to } = activtyData[0]

    const getDateTime = (date) => {
        return moment(date).format('ddd D MMM');
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

    const getTotalAmount = () => {
        let total = 0;
        activtyData.map((item) => {
            total = +total + +item.totalAmount
        })
        return decimalAdjust('floor', total, -2)
    }

    return (
        <>
            <div className="px-30 py-30 border-light rounded-8">
                <div className="d-flex justify-between">
                    <div className="text-18 fw-500 mb-30" >Activity</div>
                </div>
                <div className="border-top-light mt-30 mb-20" />
                <div className="row y-gap-20 justify-between">
                    <div className="col-auto">
                        <div key="checkin" className="text-15 fw-100">From</div>
                        <div key="date" className="fw-600 text-15">{getDateTime(from)}</div>
                    </div>
                    <div className="col-auto md:d-none">
                        <div className="h-full w-1 bg-border" />
                    </div>
                    <div className="col-auto text-right md:text-left">
                        <div key="checkout" className="text-15 f2-100">To</div>
                        <div key="date" className="fw-600 text-15">{getDateTime(to)}</div>
                    </div>
                </div>
                {/* End row */}

                <div className="border-top-light mt-30 mb-20" />
                <div className="row y-gap-20 justify-between items-center">
                    <div className="d-flex justify-between">
                        <div className="text-18  fw-600 mb-10">You selected:</div>
                        <div>
                            <span className="px-5 fw-700">Total Amount</span>
                            <span className="px-5 fw-600 ">{currency + " " + getTotalAmount()}</span>
                        </div>
                    </div>

                    {
                        activtyData.map((activity, activitiyId) => (
                            <div key={activitiyId}>
                                <div className="row justify-between">
                                    <div className="col-8">
                                        <p className="text-blue-1 fw-600 ">{activity.name}</p>
                                    </div>
                                    <div className="col-4">
                                        <p className="text-black fw-600 ">{activity.currency + " " + decimalAdjust('floor', activity.totalAmount, -2)}</p>
                                    </div>
                                </div>
                                {
                                    activity.modality.map((modality, mId) => (
                                        <div key={mId} className="px-10 mt-10 rounded-8 border">
                                            <div className="fw-500 text-18">{modality.name}</div>
                                            {
                                                modality.rates.map((rate, rateId) => (
                                                    <div key={rateId} className="px-10 py-10">
                                                        <div className="d-flex justify-between fw-500">
                                                            <span className="text-black">{getDateTime(rate.from)} - </span>
                                                            <span className="text-black">{getDateTime(rate.to)}</span>
                                                            <span className="text-black">Amount {activity.currency + " " + rate.amount}</span>
                                                        </div>
                                                        <div>
                                                            {
                                                                rate?.languages?.length > 0 ? (
                                                                    <div className=" row">
                                                                        <div className="col-6">
                                                                            <span className="fw-500 text-black">Languages</span>
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <ul>
                                                                                {
                                                                                    rate?.languages?.map((item, id) => (
                                                                                        <li key={id}>  {item.description} </li>
                                                                                    ))
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                rate?.sessions?.length > 0 ? (
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <span className="fw-500">Sessions</span>
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <ul>
                                                                                {
                                                                                    rate?.sessions?.map((item, id) => (
                                                                                        <li key={id}>  {item.code} </li>
                                                                                    ))
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                            }

                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))
                                }

                            </div>
                        ))
                    }
                </div>
            </div>
        </>

    );
};

export default SideBarTotal;
