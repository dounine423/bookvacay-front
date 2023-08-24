import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Router from "next/router";
import Seo from "../../components/common/Seo";
import Header from "../../components/header/dashboard-header";
import Footer from "../../components/admin/common/Footer";
import Sidebar from "../../components/admin/common/Sidebar";
import DashBoard from "../../components/admin/dashboard";
import Hotel from '../../components/admin/hotel'
import MarkUp from "../../components/admin/markup";
import Activity from '../../components/admin/activity'
import Setting from "../../components/admin/setting";
import BillRate from "../../components/admin/billRate"

const index = () => {
  const { userInfo } = useSelector(state => state.auth)
  const [currentItem, setCurItem] = useState(0)


  useEffect(() => {
    // if (userInfo == null || userInfo.type != 1) {
    //   Router.push({ pathname: '/login' })
    // }
  }, [])

  return (
    <>
      {/* {
        userInfo?.type == 1 ? (
          <div>
            <Seo pageTitle="Admin Dashboard" />
            <div className="header-margin"></div>
            <Header />
            <div className="dashboard">
              <div className="dashboard__sidebar bg-white scroll-bar-1">
                <Sidebar getCurItem={setCurItem} />
              </div>
              <div className="dashboard__main">
                {currentItem === 0 && <DashBoard />}
                {currentItem === 1 && <Hotel />}
                {currentItem === 2 && <Activity />}
                {currentItem === 3 && <MarkUp />}
                {currentItem === 4 && <Setting />}
                <Footer />
              </div>
            </div>
          </div>
        ) : null
      } */}
      <div>
        <Seo pageTitle="Admin Dashboard" />
        <div className="header-margin"></div>
        <Header />
        <div className="dashboard">
          <div className="dashboard__sidebar bg-white scroll-bar-1">
            <Sidebar getCurItem={setCurItem} />
          </div>
          <div className="dashboard__main">
            {currentItem === 0 && <DashBoard />}
            {currentItem === 1 && <Hotel />}
            {currentItem === 2 && <Activity />}
            {currentItem === 3 && <MarkUp />}
            {currentItem === 4 && <Setting />}
            {currentItem == 5 && <BillRate />}
            <Footer />
          </div>
        </div>
      </div>
    </>

  );
};

export default index;
