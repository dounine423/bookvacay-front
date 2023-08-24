import Router from "next/router";

const TopBreadCrumb = ({ destination, activity, type }) => {

  const onHandleBack = () => {
    Router.push({
      pathname: '/activity/activity-list'
    })
  }

  const onGoHome = () => {
    Router.push({
      pathname: '/',

    })
  }

  return (
    <section className="py-10 d-flex items-center bg-light-2">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto cursor-pointer" onClick={onGoHome}>Home</div>
              {/* End .col-auto */}
              <div className="col-auto">&gt;</div>
              {/* End .col-auto */}
              <div className="col-auto cursor-pointer" onClick={onHandleBack}>{type + " in " + destination}</div>
              {/* End .col-auto */}
              <div className="col-auto">&gt;</div>
              {/* End .col-auto */}
              <div className="col-auto">
                <div className="text-dark-1">
                  {activity}
                </div>
              </div>
              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
          {/* End .col-auto */}

          <div className="col-auto">
            <a onClick={onHandleBack} className="text-14 text-blue-1 underline cursor-pointer">
              All {type} in {destination}
            </a>
          </div>
          {/* End col-auto */}
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
    </section>
  );
};

export default TopBreadCrumb;
