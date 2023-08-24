import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Router from "next/router";
import { useRouter } from "next/router";
import Popup from 'reactjs-popup';
import Link from "next/link";
import 'reactjs-popup/dist/index.css';
import MobileMenu from "../MobileMenu";
import Image from "next/image";
import CurrenctyMegaMenu from "../CurrenctyMegaMenu";
import { addAuth } from '../../../features/auth/authSlice'
import { hotelOperation } from "../../../features/hotels/hotelSlice";
import { activityOperation } from "../../../features/activity/activity";

const Header1 = ({ currencyHandler }) => {
  const dispatch = useDispatch()
  const router = useRouter();
  const { LoggedIn, userInfo } = useSelector(state => state.auth);
  const { hotelReserve } = useSelector(state => state.hotel)
  const { activityReserve } = useSelector(state => state.activity)
  const [navbar, setNavbar] = useState(false);

  const getBadge = () => {
    let count = 0
    if (hotelReserve != null)
      count += 1
    count += activityReserve.length
    return count
  }

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
      <header className={`header  ${navbar ? "bg-dark-1 is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link href="/" className="header-logo mr-20">
                  <img src="/img/general/logo-1.png" alt="logo icon" />
                </Link>
                {
                  LoggedIn ? (
                    <div className="header-menu">
                      <div className="header-menu__content">
                        <nav className="menu js-navList ">
                          <ul className="menu__nav text-white -is-active">
                            <li className={router.pathname === "/hotel" ? "current" : ""}>
                              <Link href="/hotel"><span className="text-18 ">Hotels</span></Link>
                            </li>
                            <li className={router.pathname === "/activity" ? "current" : ""}>
                              <Link href="/activity"> <span className="text-18">Activities</span></Link>
                            </li>
                            {
                              hotelReserve != null || activityReserve.length != 0 ? (
                                <li className={router.pathname === "/cart" ? "current" : ""}>
                                  <Link href="/cart">
                                    <span className="text-18 text-white position-relative" >
                                      Cart
                                      <span className="text-10 px-10 fw-700 rounted-24 absolute" style={{ borderRadius: '50px', backgroundColor: 'red', top: '-3px', left: '35px' }}>{getBadge()}</span>
                                    </span>
                                  </Link>
                                </li>
                              ) : null
                            }

                          </ul>
                        </nav>
                      </div>
                    </div>
                  ) : null
                }

              </div>
            </div>

            {
              LoggedIn ? (
                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div className="row x-gap-20 items-center">
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
                        <div className="px-10">
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
                          <div className="px-10">
                            <p className="cursor-pointer" onClick={onAccHandler}>DashBoard</p>
                            {
                              userInfo?.type == 1 ? (
                                <p className="cursor-pointer" onClick={onAdminHandler}>Admin DashBoard</p>
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
                          className="offcanvas offcanvas-start  mobile_menu-contnet "
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
