import { useEffect, useState } from "react";
import * as Icon from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Surroundings = ({ interestPoints, terminals }) => {

  const [flags, setFlags] = useState([false, false, false])

  useEffect(() => {
    let temp = []
    if (terminals) {
      if (terminals.airport.length == 0)
        temp.push(false)
      else
        temp.push(true)
      if (terminals.railway.length == 0)
        temp.push(false)
      else
        temp.push(true)
      if (terminals.harbour.length == 0)
        temp.push(false)
      else
        temp.push(true)
    }
    setFlags([...temp])
  }, [])

  return (
    <>
      <div className="col-lg-4  mt-20 col-md-6">
        <div className="mb-40 md:mb-30" >
          <div className="d-flex items-center mb-20 ">
            <i className="icon-nearby text-20 mr-10 " style={{ color: 'blue' }}></i>
            <div className="text-18 fw-500">Interests Points</div>
          </div>
        </div>
        <div className="row y-gap-20 x-gap-0 pt-10">
          {
            interestPoints?.map((point, pointId) => (
              <div className="col-12 border-top-light" key={pointId}>
                <div className="row items-center justify-between">
                  <div className="col-auto">
                    <div className="text-17">{point.poiName}</div>
                  </div>

                  <div className="col-auto">
                    <div className="text-17 text-right">
                      {point.distance < 100 ? point.distance + " m" : point.distance / 1000 + " km"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          {
            interestPoints ? null : (
              <p >There is no interest point</p>
            )
          }
        </div>

      </div>
      <div className="col-lg-4  mt-20 col-md-6">
        <div className="mb-40 md:mb-30" >
          <div className="d-flex items-center mb-20">
            <FontAwesomeIcon icon={Icon.faPlane} size="lg" color="blue" />
            <div className="ml-10 text-18 fw-500">Closest airports</div>
          </div>
        </div>
        <div className="row y-gap-20 x-gap-0 pt-10">
          {
            terminals?.airport?.map((point, pointId) => (
              <div className="col-12 border-top-light" key={pointId}>
                <div className="row items-center justify-between">
                  <div className="col-auto">
                    <div className="text-17">{point.content}</div>
                  </div>

                  <div className="col-auto">
                    <div className="text-17 text-right">
                      {point.distance + " km"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          {

            (flags[0]) ? null : (<p >There is no closet airport</p>)
          }
        </div>
        <div className="mb-40 md:mb-30 mt-40" >
          <div className="d-flex items-center mb-20">
            <FontAwesomeIcon icon={Icon.faTrain} size="lg" color="blue" />
            <div className="text-18 ml-10 fw-500">Railway Station</div>
          </div>
        </div>
        <div className="row y-gap-20 x-gap-0 pt-10">
          {
            terminals?.railway?.map((point, pointId) => (
              <div className="col-12 border-top-light" key={pointId}>
                <div className="row items-center justify-between">
                  <div className="col-auto">
                    <div className="text-17">{point.content}</div>
                  </div>

                  <div className="col-auto">
                    <div className="text-17 text-right">
                      {point.distance + " km"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          {
            (flags[1]) ? null : (
              <p >There is no closet Railway Station</p>
            )
          }
        </div>
      </div>
      <div className="col-lg-4 mt-20 col-md-6">
        <div className="mb-40 md:mb-30" >
          <div className="d-flex items-center mb-20">
            <FontAwesomeIcon icon={Icon.faShip} size="lg" color="blue" />
            <div className="text-18 ml-10 fw-500">Closest Harbour</div>
          </div>
        </div>
        <div className="row y-gap-20 x-gap-0 pt-10">
          {
            terminals?.harbour?.map((point, pointId) => (
              <div className="col-12 border-top-light" key={pointId}>
                <div className="row items-center justify-between">
                  <div className="col-auto">
                    <div className="text-17">{point.content}</div>
                  </div>

                  <div className="col-auto">
                    <div className="text-17 text-right">
                      {point.distance + " km"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          {
            (flags[2]) ? null : (
              <p>There is no closet Harbour</p>
            )
          }
        </div>
      </div>
    </>
  );
};

export default Surroundings;
