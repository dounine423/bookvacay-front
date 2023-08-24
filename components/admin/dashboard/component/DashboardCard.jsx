import { useEffect, useState } from "react";

const data = [
  // {
  //   title: "Pending",
  //   amount: "$12,800",
  //   description: "Total pending",
  //   icon: "/img/dashboard/icons/1.svg",
  // },
  {
    title: "Total Earnings",
    amount: "$14,200",
    description: "Total earnings",
    icon: "/img/dashboard/icons/2.svg",
  },
  {
    title: "Hotel",
    amount: "$8,100",
    description: "Hotel booking earn",
    icon: "/img/dashboard/icons/3.svg",
  },
  {
    title: "Activity",
    amount: "$22,786",
    description: "Activity booking earn",
    icon: "/img/dashboard/icons/5.svg",
  },
];

const DashboardCard = ({ amountInfo }) => {

  const [amount, setAmount] = useState([])
  const [currency, setCurrency] = useState()

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

  useEffect(() => {
    const { hotel, activity, currency } = amountInfo
    let temp = []
    temp.push(decimalAdjust('floor', (hotel + activity), -2))
    temp.push(decimalAdjust('floor', hotel, -2))
    temp.push(decimalAdjust('floor', activity, -2))
    setCurrency(currency)
    setAmount([...temp])
  }, [])

  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-4 col-md-6">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="d-flex y-gap-20 justify-between items-center">
              <div >
                <div className="fw-500 lh-14">{item.title}</div>
                <div className="text-20 lh-16 fw-600 mt-5">{currency} {amount[index]}</div>
                <div className="text-15 lh-14 text-light-1 mt-5">
                  {item.description}
                </div>
              </div>
              <div >
                <img height={60} width={60} src={item.icon} alt="icon" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
