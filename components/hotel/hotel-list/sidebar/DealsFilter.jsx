import { useState } from "react";
import { useSelector , useDispatch } from "react-redux";
import { addHotelFilter } from "../../../features/hotels/hotelsFilter";

const DealsFilter = () => {
  const dispatch = useDispatch();
  const deals = useSelector((state) => state.hotelFilter.deals);
  const [freeCancel , setFreeCancel] = useState(deals || 0);
  const dealsData = [
    { label: "Free cancellation" , key: "is_free_cancellable" , value:false},
    // { label: "No Payment Block" , key: "is_no_prepayment_block" , value:false},
    // { label: "Booking From Home" , key: "is_booking_home" , value:false},
    // { label: "Mobile Booking" , key: "is_mobile_deal" , value:false},
    // { label: "Reserve now, pay at stay" value : },
    // { label: "Properties with special offers" },
  ];
  const changeCancel = () => {
    let cancellation = freeCancel == 0? 1 : 0;
    console.log(cancellation,deals);
    setFreeCancel(cancellation);
    dispatch(addHotelFilter({type : 'deals' , data: cancellation}));
  }

  return (
    <>
      {dealsData.map((deal, index) => (
        <div className="col-auto" key={index}>
          <div className="form-checkbox d-flex items-center">
            <input type="checkbox"  onChange={changeCancel} checked={deals == 0 ? "" : "checked"}/>
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon icon-check" />
            </div>
            <div className="text-15 ml-10">{deal.label}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default DealsFilter;
