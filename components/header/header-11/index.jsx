import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import MainMenu from "../MainMenu";
import MobileMenu from "../MobileMenu";
import Image from "next/image";
import CurrenctyMegaMenu from "../CurrenctyMegaMenu";
import { addAuth } from '../../../features/auth/authSlice'
import { hotelOperation } from "../../../features/hotels/hotelSlice";
import { activityOperation } from "../../../features/activity/activity";

const Header1 = ({ currencyHandler }) => {
  const dispatch = useDispatch()
  const { LoggedIn, userInfo } = useSelector((state) => state.auth);
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  const onLogoutHandler = () => {
    dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
    dispatch(activityOperation({ type: 'activityReserve', data: [] }))
    dispatch(addAuth({ type: 'LoggedIn', data: false }))
    dispatch(addAuth({ type: 'userInfo', data: null }))
    Router.push({ pathname: '/' })
  }

  const onAccHandler = () => {
    Router.push({ pathname: '/profile' })
  }

  const onAdminHandler = () => {
    Router.push({ pathname: '/admin' })
  }

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    <>
      <header className={`header bg-dark-3 ${navbar ? "is-sticky" : ""}`} >
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link href="/" className="header-logo mr-20">
                  <img src="/img/general/logo-1.png" alt="logo icon" />
                </Link>
                <div className="header-menu text-19" >
                  <div className="header-menu__content">
                    {
                      LoggedIn ? (<MainMenu style="text-black" />) : null
                    }
                  </div>
                </div>
              </div>
            </div>
            {
              LoggedIn ? (
                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div className="row x-gap-20 items-center ">
                      <CurrenctyMegaMenu textClass="text-white" onChangeCurrency={currencyHandler} />
                      <div className="col-auto">
                        <div className="w-1 h-20 bg-white-20" />
                      </div>
                    </div>
                    <div className="d-flex items-center ml-20 is-menu-opened-hide xl:d-none">
                      <Popup
                        trigger={
                          <Image
                            width={50}
                            height={50}
                            src={userInfo?.avatar ? (userInfo?.avatar) : "/img/general/default-avatar.png"}
                            alt="image"
                            className="rounded-full mr-10 cursor-pointer"
                          />
                        } position="bottom center">
                        <div className="px-10 mt-20">
                          <p className="cursor-pointer" onClick={onAccHandler}>DashBoard</p>
                          {
                            userInfo?.type == 1 ? (
                              <p className="cursor-pointer -bg-blue-1" onClick={onAdminHandler}>Admin DashBoard</p>
                            ) : null
                          }
                          <p className="cursor-pointer" onClick={onLogoutHandler}>Log out</p>
                        </div>
                      </Popup>
                    </div>
                    <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-white">
                      <div>
                        <Popup
                          trigger={
                            <Image
                              width={50}
                              height={50}
                              src={userInfo?.avatar ? (userInfo?.avatar) : "/img/general/default-avatar.png"}
                              alt="image"
                              className="rounded-full mr-10 cursor-pointer"
                            />
                          } position="bottom center">
                          <div className="px-10 mt-20">
                            <p className="cursor-pointer" onClick={onAccHandler}>DashBoard</p>
                            {
                              userInfo?.type == 1 ? (
                                <p className="cursor-pointer -bg-blue-1" onClick={onAdminHandler}>Admin DashBoard</p>
                              ) : null
                            }
                            <p className="cursor-pointer" onClick={onLogoutHandler}>Log out</p>
                          </div>
                        </Popup>
                      </div>
                      <div>
                        <button
                          className="d-flex items-center icon-menu text-inherit text-20"
                          data-bs-toggle="offcanvas"
                          aria-controls="mobile-sidebar_menu"
                          data-bs-target="#mobile-sidebar_menu"
                        />
                        <div
                          className="offcanvas offcanvas-start  mobile_menu-contnet"
                          tabIndex="-1"
                          id="mobile-sidebar_menu"
                          aria-labelledby="offcanvasMenuLabel"
                          data-bs-scroll="true"
                        >
                          <MobileMenu />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            }

          </div>
        </div>
      </header>
    </>
  );
};

export default Header1;
