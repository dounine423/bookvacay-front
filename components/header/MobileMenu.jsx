"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  ProSidebarProvider,
  Sidebar,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import ContactInfo from "./ContactInfo";

const MobileMenu = () => {
  const router = useRouter();
  const { hotelReserve } = useSelector(state => state.hotel)
  const { activityReserve } = useSelector(state => state.activity)

  const getBadge = () => {
    let count = 0
    if (hotelReserve != null)
      count += 1
    count += activityReserve.length
    return count
  }
  return (
    <>
      <div className="pro-header d-flex align-items-center justify-between border-bottom-light">
        <Link href="/">
          <img src="/img/general/logo-m.png" alt="brand" />
        </Link>
        <div
          className="fix-icon"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="icon icon-close"></i>
        </div>
      </div>
      <ProSidebarProvider>
        <Sidebar width="400" backgroundColor="#fff">
          <Menu>
            <MenuItem
              component={
                <Link
                  href="/hotel"
                  className={
                    router.pathname === "/hotel"
                      ? "menu-active-link"
                      : ""
                  }
                />
              }
            >
              Hotel
            </MenuItem>

            <MenuItem
              component={
                <Link
                  href="/activity"
                  className={
                    router.pathname === "/activity"
                      ? "menu-active-link"
                      : ""
                  }
                />
              }
            >
              Activity
            </MenuItem>
            {
              hotelReserve != null || activityReserve.length > 0 ? (
                <MenuItem
                  component={
                    <Link
                      href="/cart"
                      className={
                        router.pathname === "/cart"
                          ? "menu-active-link"
                          : ""
                      }
                    />
                  }
                >
                  <span style={{ position: 'relative' }}>
                    Cart
                    <span className="badge text-10 px-10 " style={{ backgroundColor: 'red', position: 'absolute', borderRadius: '50px' }}>
                      {getBadge()}</span></span>
                </MenuItem>
              ) : null
            }
          </Menu>
        </Sidebar>
      </ProSidebarProvider>
    </>
  );
};

export default MobileMenu;
