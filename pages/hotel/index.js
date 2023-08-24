import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from "next/router";
import dynamic from "next/dynamic";
import Seo from "../../components/common/Seo";
import Footer5 from "../../components/footer/footer-5";
import Header1 from "../../components/header/header-1";
import Dashboard from "../../components/hotel/dashboard";
import { API } from '../api/api'
import { regionAction } from "../../features/region/region";


// import BlockGuide from "../../components/block/BlockGuide";
// import Testimonial from "../../components/home/home-4/Testimonial";
// import Blog4 from "../../components/blog/Blog4";
// import Brand from "../../components/brand/Brand";
// import Counter2 from "../../components/counter/Counter2";
// import Counter from "../../components/counter/Counter";
// import ParallaxBanner from "../../components/banner/ParallaxBanner";
// import Hotels3 from "../../components/hotels/Hotels3";
// import FilterHotelsTabs2 from "../../components/hotels/filter-tabs/FilterHotelsTabs2";
// import FilterHotels2 from "../../components/hotels/FilterHotels2";
// import Link from "next/link";
// import Travellers from "../../components/home/home-4/Travellers";

const Hotel = () => {
  const dispatch = useDispatch();
  const { LoggedIn } = useSelector(state => state.auth);


  const onChangeCurrencyHandler = async (currency) => {
    const { data } = await API.post('getCurrentCurrency', currency)
    if (data.success) {
      dispatch(regionAction({ type: 'currencyInfo', data: data.result }))
    } else {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  if (LoggedIn == false) {
    Router.push({ pathname: '/login' })
  }

  useEffect(() => {
    // if (destinations == null) {
    //   getRegion()
    // }

  }, [])

  return (
    <>
      <Seo pageTitle="Hotels" />
      <Header1 currencyHandler={onChangeCurrencyHandler} />
      <ToastContainer />
      <Dashboard />

      {/* <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Destinations Travellers Love
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div>

          <div className="relative pt-40 ">
            <Travellers />
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Popular Hotels</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
          </div>
          <div className="tabs -pills-2 pt-40">
            <FilterHotelsTabs2 />
            <div className="tabs__content pt-40">
              <div className="row y-gap-30">
                <FilterHotels2 />
              </div>
            </div>
            <div className="row justify-center pt-60">
              <div className="col-auto">
                <Link
                  href="#"
                  className="button px-40 h-50 -outline-blue-1 text-blue-1"
                >
                  View All <div className="icon-arrow-top-right ml-15" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <ParallaxBanner /> */}

      {/* <section className="pt-50 pb-40 border-bottom-light">
        <div className="container">
          <div className="row justify-center text-center">
            <Counter />
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Why Choose Us</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div>

          <div className="row y-gap-40 justify-between pt-50">
            <BlockGuide />
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-10 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Best Seller</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
            <div className="col-auto tabs -pills-2 ">
              <div className="tabs__controls row x-gap-10 justify-center js-tabs-controls"></div>
            </div>
          </div>

          <div className="relative  pt-40 sm:pt-20">
            <div className="row y-gap-30">
              <Hotels3 />
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="section-bg layout-pt-lg layout-pb-lg">
        <div className="section-bg__item -mx-20 bg-light-2" />
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Overheard from Travelers
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div>
          <div className="relative mt-80 md:mt-40  position-relative">
            <Testimonial />
          </div>
          <div className="row y-gap-30 items-center pt-40 sm:pt-20">
            <div className="col-xl-4">
              <Counter2 />
            </div>
            <div className="col-xl-8">
              <div className="row y-gap-30 justify-between items-center">
                <Brand />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Get inspiration for your next trip
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames
                </p>
              </div>
            </div>
          </div>
          <div className="row y-gap-30 pt-40">
            <Blog4 />
          </div>
     
        </div>
   
      </section> */}


      <div className="mt-30" />
      <Footer5 />
    </>
  );
};

export default dynamic(() => Promise.resolve(Hotel), { ssr: false });
