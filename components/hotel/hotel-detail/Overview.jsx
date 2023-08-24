import { useState } from "react";
const Overview = (props) => {
  const [showMore, setShowMore] = useState(false);

  const changeShow = () => {
    setShowMore(!showMore);
  }
  return (
    <>
      <h3 className="text-22 fw-500 pt-40 border-top-light">Overview</h3>
      {/* {props.description.slice(0, lines).map((item, index) => ( */}
      <p className="text-dark-1 text-15 mt-20" >
        {showMore ? props?.description : props?.description?.slice(0, 500) + "..."}

      </p>
      {/* ))} */}
      <button
        className="d-block text-14 text-blue-1 fw-500 underline mt-10"
        onClick={changeShow}
      >
        Show {showMore ? "Less" : "More"}
      </button>
    </>
  );
};

export default Overview;
