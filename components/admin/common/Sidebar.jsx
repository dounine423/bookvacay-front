import Image from "next/image";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { addAuth } from '../../../features/auth/authSlice'
import { activityOperation } from "../../../features/activity/activity";
import { hotelOperation } from '../../../features/hotels/hotelSlice'

const Sidebar = ({ getCurItem }) => {
  const dispatch = useDispatch()
  const onDashBoardHandler = () => {
    getCurItem(0)
  }

  const onHotelHandler = () => {
    getCurItem(1)
  }

  const onActivityHandler = () => {
    getCurItem(2)
  }

  const onMarkUpHandler = () => {
    getCurItem(3)
  }

  const onSettingHandler = () => {
    getCurItem(4)
  }

  const onLogOutHandler = () => {
    dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
    dispatch(activityOperation({ type: 'activityReserve', data: [] }))
    dispatch(addAuth({ type: 'LoggedIn', data: false }))
    dispatch(addAuth({ type: 'userInfo', data: null }))
    Router.push({ pathname: '/' })
  }

  const billRateHandler = () => {
    getCurItem(5)
  }

  return (
    <>
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
        <div className="sidebar__item" onClick={onDashBoardHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            Dashboard
          </a>
        </div>
        <div className="sidebar__item" onClick={onHotelHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            Hotel Booking Manager
          </a>
        </div>
        <div className="sidebar__item" onClick={onActivityHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            Activity Booking  Manager
          </a>
        </div>
        <div className="sidebar__item" onClick={onMarkUpHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            MarkUp Manager
          </a>
        </div>
        <div className="sidebar__item" onClick={billRateHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            BillRate Manager
          </a>
        </div>
        <div className="sidebar__item" onClick={onSettingHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            Admin Setting
          </a>
        </div>

        <div className="sidebar__item" onClick={onLogOutHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/log-out.svg"
              alt="image"
              className="mr-15"
            />
            Logout
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
