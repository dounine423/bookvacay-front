const TopHeaderFilter = ({ location, total }) => {
  return (
    <>
      <div className="row y-gap-10 items-center justify-between">
        <div className="col-auto">
          <div className="text-18">
            <span className="fw-500">{total} properties in  </span>  {location ? location : ""}
          </div>
        </div>
        <div className="col-auto">
          <div className="row x-gap-20 y-gap-20">
            <div className="col-auto d-none xl:d-block">
              <button
                data-bs-toggle="offcanvas"
                data-bs-target="#listingSidebar"
                className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1"
              >
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHeaderFilter;
