import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Router from "next/router";
import Seo from "../../components/common/Seo";
import Header from "../../components/header/dashboard-header";
import Footer from '../../components/profile/Footer'
import Sidebar from "../../components/profile/Sidebar";
import SettingsTabs from "../../components/profile/person-detail";
import HotelBookList from '../../components/profile/hotel-book'
import ActivityBookList from '../../components/profile/activity-book'

const index = () => {
  const { userInfo } = useSelector(state => state.auth)
  const pageList = [
    "Personal Details",
    "Hotel Booking List",
    "Activity Booking List"
  ]
  const [curPage, setCurPage] = useState(0)

  useEffect(() => {
    if (userInfo == null) {
      Router.push({ pathname: '/login' })
    }
  }, [userInfo])

  return (
    <>
      {
        userInfo ? (
          <div>
            <Seo pageTitle="Settings" />
            <div className="header-margin"></div>
            <Header />
            <div className="dashboard">
              <div className="dashboard__sidebar bg-white scroll-bar-1">
                <Sidebar getCurPage={setCurPage} />
              </div>
              <div className="dashboard__main">
                {curPage == 0 && <HotelBookList />}
                {curPage == 1 && <ActivityBookList />}
                {curPage == 2 && <SettingsTabs />}
                <Footer />
              </div>
            </div>
          </div>
        ) : null
      }

    </>
  );
};

export default index;
