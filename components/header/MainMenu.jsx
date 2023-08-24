import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const MainMenu = () => {
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
    <nav className="menu js-navList ">
      <ul className="menu__nav text-white -is-active">
        <li className={router.pathname === "/hotel" ? "current" : ""}>
          <Link href="/hotel"><span className="text-18">Hotels</span></Link>
        </li>
        <li className={router.pathname === "/activity" ? "current" : ""}>
          <Link href="/activity"> <span className="text-18">Activities</span></Link>
        </li>
        {
          hotelReserve != null || activityReserve.length != 0 ? (
            <li className={router.pathname === "/cart" ? "current" : ""}>
              <Link href="/cart">
                <span className="text-18" style={{ position: 'relative' }}>
                  Cart
                  <span className="text-10 px-10 fw-700 rounted-24" style={{ borderRadius: '50px', backgroundColor: 'red', position: "absolute", top: '-3px', left: '35px' }}>{getBadge()}</span>
                </span>
              </Link>
            </li>
          ) : null
        }

      </ul>
    </nav>
  );
};

export default MainMenu;
