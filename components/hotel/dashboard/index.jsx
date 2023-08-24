import MainFilterSearchBox from "../common/MainFilterSearchBox";

const index = () => {
  return (
    <>
      <section className="masthead -type-6">
        <div className="masthead__bg bg-dark-3">
          <img alt="image" src="/img/masthead/4/bg.png" className="js-lazy" />
        </div>
        <div className="masthead__content">
          <div className="container">
            <div className="row justify-center">
              <div className="col-xl-9">
                <div
                  className="text-center"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-offset="0"
                >
                  <h1 className="text-50 lg:text-40 md:text-30 text-white">
                    Find Your Dream Luxury Hotel
                  </h1>
                  <p className="text-white mt-5">
                    Discover amzaing places at exclusive deals
                  </p>
                </div>
                {/* End text-center */}
                <MainFilterSearchBox
                  flag={true}
                />
                {/* End tab-filter */}
              </div>
            </div>
          </div>
        </div>
        {/* End next navigation */}
      </section>
      {/* End section */}
    </>
  );
};

export default index;
