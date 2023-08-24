import { useState } from 'react'

const Overview = ({ description }) => {

  const [moreFlag, setMoreFlag] = useState(false)

  const onShowMoreHandler = () => {
    setMoreFlag(!moreFlag)
  }

  return (
    <>
      <div className="row x-gap-40 y-gap-40">
        <div className="col-12">
          <h3 className="text-22 fw-500">Overview</h3>
          <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: moreFlag ? description : description.slice(0, 450) }}>

          </div>
          <a
            onClick={onShowMoreHandler}
            className="d-block text-14 text-blue-1 fw-500 underline mt-10 cursor-pointer"
          >
            Show {moreFlag ? "Less" : "More"}
          </a>
        </div>
      </div>
    </>
  );
};

export default Overview;
