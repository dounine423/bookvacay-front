import moment from "moment";
import { useSelector } from "react-redux";

const BookingDetails = ({ hotelData }) => {
  const { inDate, outDate, reserveData, totalAmount, name } = hotelData
  const { currency } = useSelector(state => state.region)

  const getDateTime = (date) => {
    return moment(date).format('ddd D MMM Y');
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

  const renderRoom = () => {
    let rooms = []
    reserveData.map((item) => {
      let flag = null
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].roomCode == item.roomCode)
          flag = i
      }
      if (flag != null) {
        rooms[flag].count += item.roomCnt
      } else {
        rooms.push({ code: item.roomCode, name: item.roomName, count: item.roomCnt })
      }
    })
    return (
      <>
        {rooms.map((room, roomId) => (
          <p key={roomId} className="text-black text-15">{room.count + " * " + room.name}</p>
        ))}
      </>
    )
  }


  return (
    <>
      <div className="px-30 py-30 border-light rounded-8">
        <div className="text-18 fw-500 mb-30" >{name}</div>
        <div className="border-top-light mt-30 mb-20" />
        <div className="row y-gap-20 justify-between">
          <div className="col-auto">
            <div key="checkin" className="text-15 fw-100">Check-in</div>
            <div key="date" className="fw-600 text-15">{getDateTime(inDate)}</div>
          </div>
          <div className="col-auto md:d-none">
            <div className="h-full w-1 bg-border" />
          </div>
          <div className="col-auto text-right md:text-left">
            <div key="checkout" className="text-15 f2-100">Check-out</div>
            <div key="date" className="fw-600 text-15">{getDateTime(outDate)}</div>
          </div>
        </div>

        <div className="border-top-light mt-30 mb-20" />
        <div>
          <div className="text-15">Total length of stay:</div>
          <div className="fw-500">{datediff(inDate, outDate)} nights</div>
        </div>

        <div className="border-top-light mt-30 mb-20" />
        <div className="row y-gap-20 justify-between items-center">
          <div className="col-auto">
            <div className="text-18  fw-600 mb-10">You selected:</div>
            {
              renderRoom()
            }
          </div>
        </div>
        <div>
          <div className="text-18 py-10 mt-10 fw-500 ">Your Price Summary</div>
          <div className="d-flex  py-10 justify-between">
            <h3 className="text-18">Price</h3>
            <div>
              <h3 className="text-18">{currency + " " + decimalAdjust('floor', totalAmount, -2)}</h3>
            </div>
          </div>

        </div>
      </div>
    </>

  );
};

export default BookingDetails;
