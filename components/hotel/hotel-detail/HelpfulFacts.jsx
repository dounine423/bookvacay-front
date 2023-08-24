import { useEffect, useState } from "react";
import moment from "moment";

const HelpfulFacts = ({ facts, indFee }) => {

  const [facility, setFacility] = useState([])

  useEffect(() => {
    let temp = [...facts]
    setFacility([...temp])
  }, [])

  const getTime = (time) => {
    let now = moment().format('YYYY-MM-DD')
    let curTime = moment(now + "T" + time)
    let result = curTime.format('h:mm A')
    return result
  }

  const renderFacility = (data, code) => {
    let renderData = []
    data.map((item, id) => {
      const { timeFrom, amount, currency, distance, name, facilityCode, timeTo } = item
      if (code == 0 && facilityCode == 260)
        renderData.push(<div key={id} className="mr-15 fw-400">{name}  <div className="fw-500">From {getTime(timeFrom)} {timeTo ? (" To " + getTime(timeTo)) : null}</div>  </div>)
      if (code == 0 && facilityCode == 390)
        renderData.push(<div key={id} className="mr-15">{name}  <div className="fw-500">Until {timeFrom ? getTime(timeFrom) : getTime(timeTo)} </div> </div>)
      if (code == 40)
        renderData.push(<div key={id} className="mr-15">{name} <span className="fw-500">{distance < 100 ? (distance + " m") : (distance / 1000 + " km")} </span> </div>)
      if (code == 70)
        renderData.push(<div key={id} className="mr-15">{name}  <span className="fw-500">{amount ? (currency + " " + amount) : ""}</span> </div>)
    })
    return (
      <>
        {renderData}
      </>
    )
  }

  return (
    <div className="rounded-8 border ">
      {
        facility?.map((fact, factId) => (

          fact.code != 30 ? (
            < div key={factId} className="row mt-20" >
              {
                fact?.data?.length > 0 ? (
                  <>
                    <div className="col-4 d-flex">
                      <i className={fact.icon + " text-20 mr-10"} />
                      <div className="text-16 fw-500">{fact.name}</div>
                    </div>
                    <div className="col-8 payFacility">
                      {
                        renderFacility(fact.data, fact.code)
                      }
                    </div>
                  </>
                ) : null
              }
            </div>) : null
        ))
      }
      <div className="row mt-20">
        <div className="col-4 d-flex">
          <i className="icon-ticket text-20 mr-10" />
          <div className="text-16 fw-500">Extra Cost</div>
        </div>
        <div className="col-8 payFacility">
          {
            renderFacility(indFee, 70)
          }
        </div>
      </div>
      {
        // indFee?.map((facility))
      }
    </div >
  );
};

export default HelpfulFacts;
