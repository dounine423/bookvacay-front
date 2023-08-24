import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MobileMenu from "../MobileMenu";
import * as Icon from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HeaderDashBoard = () => {
  const router = useRouter();
  const [navbar, setNavbar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { LoggedIn, userInfo } = useSelector(state => state.auth);
  const { hotelReserve } = useSelector(state => state.hotel)
  const { activityReserve } = useSelector(state => state.activity)

  const getBadge = () => {
    let count = 0
    if (hotelReserve != null)
      count += 1
    count += activityReserve.length
    return count
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    const body = document.querySelector("body");
    if (isOpen) {
      body.classList.add("-is-sidebar-open");
    } else {
      body.classList.remove("-is-sidebar-open");
    }
  }, [isOpen]);

  return (
    <>
      <header
        className={`header -dashboard ${navbar ? "is-sticky bg-white" : ""}`}
      >
        <div className="header__container px-30 sm:px-20">
          <div className="-left-side">
            <Link href="/" className="header-logo">
              <img src="/img/general/logo-m.png" alt="logo icon" />
            </Link>
          </div>
          <div className="row justify-between items-center  lg:pl-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                <button className="d-flex" onClick={handleToggle}>
                  <FontAwesomeIcon icon={isOpen ? Icon.faChevronRight : Icon.faChevronLeft} size="lg" color="black" />
                </button>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="header-menu">
                  <div className="header-menu__content">
                    <div className="header-menu">
                      <div className="header-menu__content">
                        <nav className="menu js-navList ">
                          <ul className="menu__nav text-blue-1 -is-active">
                            <li className={router.pathname === "/hotel" ? "current" : ""}>
                              <Link href="/hotel"><span className="text-18 ">Hotels</span></Link>
                            </li>
                            <li className={router.pathname === "/activity" ? "current" : ""}>
                              <Link href="/activity"> <span className="text-18">Activities</span></Link>
                            </li>
                            {
                              hotelReserve != null || activityReserve.length != 0 ? (
                                <li className={router.pathname === "/destinations" ? "current" : ""}>
                                  <Link href="/cart">
                                    <span className="text-18 text-blue-1 position-relative" >
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
                  </div>
                </div>
                <div className="row items-center x-gap-5 y-gap-20 pl-20 lg:d-none">
                  {/* <div className="col-auto">
                    <button className="button -blue-1-05 size-50 rounded-22 flex-center">
                      <i className="icon-email-2 text-20"></i>
                    </button>
                  </div>
                  <div className="col-auto">
                    <button className="button -blue-1-05 size-50 rounded-22 flex-center">
                      <i className="icon-notification text-20"></i>
                    </button>
                  </div> */}
                </div>
                <div className="pl-15">
                  <Image
                    width={50}
                    height={50}
                    src={userInfo?.avatar ? (userInfo?.avatar) : "/img/general/default-avatar.png"}
                    alt="image"
                    className="size-50 rounded-22 object-cover"
                  />
                </div>
                <div className="d-none xl:d-flex x-gap-20 items-center pl-20">
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    ></button>
                  </div>

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
        </div>
      </header>
    </>
  );
};

export default HeaderDashBoard;
