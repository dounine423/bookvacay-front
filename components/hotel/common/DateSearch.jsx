import React, { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import moment from "moment";

const DateSearch = ({ getInDate, getOutDate, inDate, outDate }) => {

  const [dates, setDates] = useState([
    new DateObject(Date.now()),
    new DateObject(Date.now()).add(7, 'd'),
  ]);
  const changeDates = (dates) => {
    setDates(dates);
    if (dates.length > 1) {
      getInDate(getDateFromCalendar(dates[0]))
      getOutDate(getDateFromCalendar(dates[1]))
    }
  }

  const getDateFromCalendar = (date) => {
    let fullDate = date.year + "-" + date.month.number + "-" + date.day;
    return moment(fullDate).format('YYYY-MM-DD');
  }

  useEffect(() => {
    setDates([
      new DateObject(inDate),
      new DateObject(outDate)
    ])
  }, [])

  return (
    <div className="text-15 text-light-1 ls-2 lh-16 custom_dual_datepicker px-20 py-10">
      <DatePicker
        inputClass="custom_input-picker"
        containerClassName="custom_container-picker"
        value={dates}
        onChange={changeDates}
        numberOfMonths={2}
        offsetY={10}
        range
        rangeHover
        format="MMMM DD"
      />
    </div>
  );
};

export default DateSearch;
