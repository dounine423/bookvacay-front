import { useState, useEffect } from "react";
import moment from "moment";
import DatePicker, { DateObject } from "react-multi-date-picker";

const ChartSelect = ({ getType, type, getGroup, group, getDate, getRequest }) => {

  const types = [
    "Hotel",
    "Activity"
  ]

  const groups = [
    "1D",
    "1M",
    "1Y",
    "Total"
  ]

  const [curType, setCurType] = useState(type)
  const [curGroup, setCurGroup] = useState(group)
  const [dates, setDates] = useState(new DateObject());

  const onTypeHandler = (e) => {
    let index = e.target.selectedIndex
    setCurType(index)
    getType(index)
    getRequest(true)
  }

  const onGroupHandler = (e) => {
    let index = e.target.selectedIndex
    setCurGroup(index)
    getGroup(index)
    getRequest(true)
  }

  const changeDate = (value) => {
    let temp = value.year + "-" + value.month.number + "-" + value.day
    let f_date = moment(temp)
    let result = {
      year: f_date.format('YYYY'),
      month: f_date.format('MM'),
      day: f_date.format('DD'),
    }
    getDate(result)
    getRequest(true)
  }

  useEffect(() => {

  }, [])

  return (
    <div className="row justify-end">
      <div className="col-lg-2 col-sm-12 py-10 px-10" >
        <select defaultValue={types[curType]} className="form-control rounded-16" onChange={onTypeHandler}>
          {
            types?.map((typeI, typeId) => (
              <option className="text-center" key={typeId}>{typeI}</option>
            ))
          }
        </select>
      </div>
      <div className="col-lg-2 col-sm-12 py-10 px-10">
        <select defaultValue={groups[curGroup]} className="form-control rounded-16" onChange={onGroupHandler}>
          {
            groups?.map((groupI, groupId) => (
              <option key={groupId} className="text-center">{groupI}</option>
            ))
          }
        </select>
      </div>
      <div className="col-lg-2 col-sm-12 w-230 single-field relative d-flex items-center ">
        <DatePicker
          inputClass="custom_input-picker"
          containerClassName="custom_container-picker date-input bg-white text-dark-1 h-50 rounded-8 pl-30"
          value={dates}
          onChange={changeDate}
          numberOfMonths={1}
          offsetY={10}
          format="YYYY-MM-DD"
        />

        <button className="absolute d-flex items-center h-full pointer-events-none">
          <i className="icon-calendar text-20 px-15 text-dark-1" />
        </button>
      </div>
    </div>

  );
};

export default ChartSelect;
