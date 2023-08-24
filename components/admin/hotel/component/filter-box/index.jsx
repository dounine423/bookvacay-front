import React, { useState } from "react";
// import DatePicker from 'react-datepicker'
import DatePicker, { DateObject } from "react-multi-date-picker";
import moment, { now } from "moment";

const FilterBox = ({ getDates, getSearch, setFlag, setPagination }) => {

  const [dates, setDates] = useState([new DateObject(now()).subtract(1, 'M'), new DateObject(now())]);
  const [search, setSearch] = useState("")
  const [timer, setTimer] = useState(null)

  const onDateChangeHandler = (values) => {
    if (values.length > 1) {
      setDates(values)
      let from = getDateFromCalendar(values[0])
      let to = getDateFromCalendar(values[1])
      getDates({ from, to })
      setPagination(1)
      setFlag(true)
    }
  }

  const onSearchWordChangeHandle = (e) => {
    let value = e.target.value
    setSearch(value)
    getSearch(value)
    clearInterval(timer)
    let resTimer = setTimeout(() => {
      setPagination(1)
      setFlag(true)
    }, 1500)
    setTimer(resTimer)
  }

  const getDateFromCalendar = (date) => {
    let fullDate = date.year + "-" + date.month.number + "-" + date.day;
    return moment(fullDate).format('YYYY-MM-DD');
  }

  return (
    <div className="row x-gap-20 y-gap-20 items-center">
      <div className="col-auto">
        <div className="w-230 single-field relative d-flex items-center ">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker date-input bg-white text-dark-1 h-50 rounded-8 pl-30"
            value={dates}
            onChange={onDateChangeHandler}
            numberOfMonths={2}
            offsetY={10}
            format="MMMM DD"
            range
            rangeHover
          />

          <button className="absolute d-flex items-center h-full pointer-events-none">
            <i className="icon-calendar text-20 px-15 text-dark-1" />
          </button>
        </div>
      </div>
      {/* <div className="col-auto">
        <DropdownFilter />
      </div> */}

      <div className="col-auto">
        <div className="w-230 single-field relative d-flex items-center">
          <input
            className="pl-50 bg-white text-dark-1 h-50 rounded-8"
            type="text"
            placeholder="Search"
            required
            value={search}
            onChange={onSearchWordChangeHandle}
          />
          <button type="submit" className="absolute d-flex items-center h-full">
            <i className="icon-search text-20 px-15 text-dark-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
