import AppButton from "./AppButton";
import ContactInfo from "./ContactInfo";
import Copyright from "./Copyright";
import FooterContent from "./FooterContent";
import Social from "../../common/social/Social";
import Subscribe from "./Subscribe";

const index = () => {
  return (
    <footer className="footer -type-2 bg-dark-2 text-white">
      <div className="container">
        <div className="">
          <div className="row y-gap-40 justify-between xl:justify-start">
            <div className="col-xl-4 col-lg-6 h-25" >
              <img src="/img/general/logo-1.png" style={{ height: '100px' }} alt="image" />
            </div>
            <div className="col-lx-8 col-lg-6 ">
              <p className="fw-500 text-white text-22 mt-20">Contact Us</p>
              <ContactInfo />
            </div>
          </div>
        </div>
        <div className="py-20 border-top-white-15">
          <Copyright />
        </div>
      </div>
    </footer>
  );
};

export default index;
