import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Router from "next/router";

const HotelProperties = ({ availData, hotelAvail, hotelData, contentId, availId }) => {

  const { imageUrl, defaultImg } = useSelector(state => state.hotel)
  const { currency } = useSelector(state => state.region)
  const [flag, setFlag] = useState(false)

  const onViewDetail = () => {
    Router.push({
      pathname: '/hotel/hotel-detail',
      query: {
        contentId,
        availId
      }
    })
  }

  const datediff = (firstDate, secondDate) => {
    return Math.round((new Date(secondDate) - new Date(firstDate)) / 1000 / 60 / 60 / 24);
  }

  const renderCategory = (simpleCode) => {
    let renderData = [];
    for (let i = 0; i < simpleCode; i++) {
      renderData.push(<i key={i} className="icon-star text-20 text-yellow-1" />)
    }
    return (
      <>
        {renderData}
      </>
    )
  }

  const getMainImage = (images) => {
    if (images != null) {
      let image = images.find((hotelData) => {
        return hotelData.imageTypeCode == "GEN"
      })
      return imageUrl + image.path;
    } else
      return defaultImg

  }

  const changeShow = () => {
    setFlag(!flag)
  }

  const getReviewWord = (score) => {
    if (1 <= score && score < 3.5) {
      return "Review Score"
    }
    if (3.5 <= score && score < 4) {
      return "Good"
    }
    if (4 <= score && score <= 4.25) {
      return "Very Good"
    }
    if (4.25 < score && score < 4.5) {
      return "Fabulous"
    }
    if (4.5 <= score && score <= 5) {
      return "Exceptional"
    }
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

  useEffect(() => {
    let len = hotelData.boards.length;
    if (len > 3)
      setFlag(true)

  }, [])

  return (
    <>
      <div className="col-12 mt-10" >
        <div className="border-top-light pt-30">
          <div className="row x-gap-20 y-gap-20">
            <div className="col-md-auto">
              <div className="cardImage ratio ratio-1:1 w-250">
                <div className="cardImage__content">
                  <Image
                    width={300}
                    height={300}
                    className="rounded-4 col-12 js-lazy"
                    src={getMainImage(hotelData.images)}
                    alt="image"
                  />
                </div>

                <div className="cardImage__wishlist">
                  <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                    <i className="icon-heart text-12"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md">
              <h3 className="text-16 lh-16 fw-500">
                {hotelData.name}
                <br className="lg:d-none" /> in {hotelData.address}
                <div className="d-inline-block ml-10">
                  {
                    renderCategory(hotelData.category)
                  }
                </div>
              </h3>
              {
                hotelData.cityDistance != null ? (<div className="row x-gap-10 y-gap-10 items-center pt-10">
                  <div className="col-auto text-16">
                    <i className="icon-location-2 mr-5"></i>
                    <span className="mr-5">{hotelData.city}</span>
                    <span className="fw-100">{" - " + hotelData.cityDistance.distance < 1000 ? hotelData.cityDistance.distance + " m" : hotelData.cityDistance.distance / 1000 + " km from center"}</span>
                  </div>
                </div>) : null
              }


              <div className="text-14 lh-15 mt-10">
                <div className="fw-500">Board Types</div>
              </div>
              {
                hotelData.boards ? (
                  <div>
                    {
                      flag ? (
                        hotelData.boards.slice(0, 3).map((board, id) => (
                          < div key={id} className="text-14 text-green-2 lh-15 mt-5" >
                            <div className="fw-500">{board}</div>
                          </div>
                        ))
                      ) : (
                        hotelData.boards.map((board, id) => (
                          < div key={id} className="text-14 text-green-2 lh-15 mt-5" >
                            <div className="fw-500">{board}</div>
                          </div>
                        ))
                      )
                    }
                    {
                      hotelData.boards.length > 4 ? (<button
                        className="d-block text-14 text-blue-1 fw-500 underline mt-10"
                        onClick={() => changeShow()}
                      >
                        Show  {flag ? "more" : "less"}
                      </button>) : null
                    }
                  </div>

                ) : null
              }

            </div>

            <div className="col-md-auto text-right md:text-left">
              <div className="row x-gap-10 y-gap-10 justify-end items-center md:justify-start">
                <div className="col-auto">
                  <div className="text-14 lh-14 fw-500"></div>
                  <div className="text-14 lh-14 text-light-1">

                  </div>
                </div>
                <div className="col-auto d-flex">
                  <div className="col-auto mr-10">
                    <div className="text-20 lh-14 fw-500">{getReviewWord(hotelAvail.reviews[0].rate)}</div>
                    <div className="text-16 lh-14 text-light-1 mt-1">
                      {hotelAvail.reviews[0].reviewCount} reviews
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="flex-center text-white fw-600 text-18 size-50 rounded-4 bg-blue-1">
                      {hotelAvail.reviews[0].rate}
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-10">
                <div className="text-15">
                  <span>{datediff(availData.inDate, availData.outDate) + " nights"}</span>
                  {
                    availData.adults > 0 ? (
                      <span>
                        {" , " + availData.adults + " adults"}
                      </span>) : null
                  }
                  {
                    availData.children > 0 ? (
                      <span>
                        {" , " + availData.children + " children"}
                      </span>) : null
                  }
                </div>
                <div className="fw-500 text-20">
                  {
                    currency + " " + decimalAdjust('floor', (hotelAvail.minRate / availData.rooms), -2)
                  }
                  {
                    hotelAvail.allotment < 6 ? (
                      <div className="text-15" style={{ color: 'red' }}>Only {hotelAvail.allotment} {hotelAvail.allotment == 1 ? "room" : "rooms"} left at this price on our site</div>
                    ) : null
                  }
                </div>
                <div className="d-flex justify-content-end">
                  <a
                    onClick={() => onViewDetail()}
                    target="_blank"
                    className="button -md  bg-blue-1 cursor-pointer text-white mt-10 -dark-1"
                  >
                    See Availability
                    <div className="icon-arrow-top-right ml-15"></div>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default HotelProperties;
