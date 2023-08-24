import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import * as Icon from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ActivityProperties = ({ activity, getDetail }) => {

  const { currency } = useSelector(state => state.region)

  const [showMore, setShowMore] = useState(false)

  const onDetailHandler = (code) => {
    if (getDetail)
      getDetail(code)
  }

  const convertUp2Lower = (str) => {
    let first = str[0]
    let rest = str.slice(1, str.length)
    rest = rest.toLowerCase()
    return first + rest
  }

  const onShowMoreHandler = () => {
    setShowMore(!showMore)
  }

  return (
    <div
      className="col-lg-4 col-sm-6 shadow-1 px-15 px-5"
      data-aos="fade"
      data-aos-delay={100}
    >
      <a onClick={() => onDetailHandler(activity.code)} className="activityCard -type-1 rounded-4 cursor-pointer hover-inside-slider">
        <div className="activityCard__image position-relative">
          <div className="inside-slider">
            <Image
              width={300}
              height={300}
              className="col-12 js-lazy"
              src={activity.image}
              alt="image"
            />
            <div className="cardImage__wishlist">
              <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                <i className="icon-heart text-12" />
              </button>
            </div>
          </div>
        </div>
        <h4 className="activityCard__title lh-16 fw-500 text-dark-1 text-18">
          <span>{activity.name}</span>
        </h4>
      </a>
      <div className="activityCard__content mt-10">

        <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: showMore ? activity.description : activity.description.slice(0, 150) }} />
        <a
          onClick={onShowMoreHandler}
          className="d-block text-14 text-blue-1 fw-500 underline mt-10 cursor-pointer"
        >
          Show {showMore ? "Less" : "More"}
        </a>
        <div className="row justify-between  pt-10">
          {
            activity?.amount?.map((item, id) => (
              <div className="col-auto fw-500" key={id}>
                <span className=""> {convertUp2Lower(item?.paxType)}</span>
                <span className="px-10"> ( {item?.ageFrom} - {item?.ageTo > 50 ? <FontAwesomeIcon icon={Icon.faInfinity} size="sm" color="black" style={{ marginRight: '3px' }} /> : item?.ageTo})</span>
                <span>{item?.amount} {currency}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ActivityProperties;
