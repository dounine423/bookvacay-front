import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Router from "next/router";
import { addAuth } from "../../features/auth/authSlice";
import { hotelOperation } from "../../features/hotels/hotelSlice";
import { activityOperation } from "../../features/activity/activity";

const Sidebar = ({ getCurPage }) => {

  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.auth)

  const onDashBoardHandler = () => {
    getCurPage(2)
  }

  const onHotelHandler = () => {
    getCurPage(0)
  }

  const onActivityHandler = () => {
    getCurPage(1)
  }

  const onLogOutHandler = () => {
    dispatch(hotelOperation({ type: 'hotelReserve', data: null }))
    dispatch(activityOperation({ type: 'activityReserve', data: [] }))
    dispatch(addAuth({ type: 'LoggedIn', data: false }))
    dispatch(addAuth({ type: 'userInfo', data: null }))
    Router.push({ pathname: '/' })
  }

  return (
    <>
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
        <div className="sidebar__item" onClick={onHotelHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            Hotel Booking Manager
          </a>
        </div>
        <div className="sidebar__item" onClick={onActivityHandler}>
          <a
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            Activity Booking Manager
          </a>
        </div>
        <div className="sidebar__item" onClick={onDashBoardHandler}>
          {
            userInfo?.type == 2 ? (
              <a
                className="sidebar__button d-flex items-center text-15 lh-1 fw-500 cursor-pointer"
              >
                <Image
                  width={20}
                  height={20}
                  src="/img/dashboard/sidebar/compass.svg"
                  alt="image"
                  className="mr-15"
                />
                Personal details
              </a>
            ) : null
          }

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
        {/* End accordion__item */}
      </div>
    </>
  );
};

export default Sidebar;
