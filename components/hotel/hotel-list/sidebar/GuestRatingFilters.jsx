const GuestRatingFilters = () => {
  const options = [
    { label: "Fair 5+", value: "5"},
    { label: "Pleasant 6+", value: "6"},
    { label: "Good 7+", value: "7"},
    { label: "Very Good 8+", value: "8"},
    { label: "Wonderful 9+", value: "9"},
    // { label: "No rating 3.5+", value: "0"}
  ];

  return (
    <>
      {options.map((option, index) => (
        <div className="row y-gap-10 items-center justify-between" key={index}>
          <div className="col-auto">
            <div className="form-radio">
              <div className="radio d-flex items-center">
                <input type="radio" name="rating" value={option.value} />
                <div className="radio__mark">
                  <div className="radio__icon" />
                </div>
                <div className="ml-10">{option.label}</div>
              </div>
            </div>
          </div>
          {/* End .col */}

          <div className="col-auto">
            <div className="text-15 text-light-1">{option.count}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default GuestRatingFilters;
