import { useSelector, useDispatch } from "react-redux";

import Router from "next/router";
import dynamic from "next/dynamic";
import Seo from "../../components/common/Seo";
import Header1 from "../../components/header/header-1";
import Footer5 from "../../components/footer/footer-5"
import Dashboard from "../../components/activity/dashboard";
import { API } from "../api/api";
import { regionAction } from "../../features/region/region";

const ActivityDashBoard = () => {
  const dispatch = useDispatch()
  const { LoggedIn } = useSelector(state => state.auth)

  if (LoggedIn == false) {
    Router.push({ pathname: '/login' })
  }

  const onCurrencyChangeHandler = async (currency) => {
    const { data } = await API.post('/getCurrentCurrency', currency)
    if (data.success) {
      dispatch(regionAction({ type: 'currencyInfo', data: data.result }))
    }
  }

  return (
    <>
      <Seo pageTitle="Activities" />
      <Header1 currencyHandler={onCurrencyChangeHandler} />
      <Dashboard />

      {/* <section className="layout-pt-md layout-pb-md bg-light-2">
        <div className="container">
          <div className="row y-gap-30">
            <BlockGuide />
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Special Offers</h2>
                <p className=" sectionTitle__text  mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div>
          
          <div className="row y-gap-20 pt-40">
            <AddBanner />
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center is-in-view">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Trending Activity</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
          </div>
          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Activity />
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Adventure &amp; Activity
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
          </div>
          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <TourCategories />
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-lg layout-pb-md" data-aos="fade-up">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Popular Destinations</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
            <div className="col-auto md:d-none">
              <a
                href="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                View All Destinations
                <div className="icon-arrow-top-right ml-15" />
              </a>
            </div>
          </div>
          <div className="relative pt-40 sm:pt-20">
            <PopularDestinations />
          </div>
        </div>
      </section> */}

      {/* <section className="section-bg layout-pt-lg layout-pb-lg bg-light-2">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Testimonials</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-center pt-50 md:pt-30">
            <div className="col-xl-7 col-lg-10">
              <div className="overflow-hidden">
                <Testimonials />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center is-in-view">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Recommended Activity</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
          </div>
          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Activity2 />
          </div>
        </div>
      </section>
      <AppBanner /> */}

      {/* <section className="layout-pt-md layout-pb-lg">
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
            <Blog />
          </div>
        </div>
      </section> */}
      <div className="mt-20" />
      <Footer5 />
    </>
  );
};

export default dynamic(() => Promise.resolve(ActivityDashBoard), { ssr: false });
