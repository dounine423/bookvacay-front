import dynamic from "next/dynamic";
import Footer5 from "../components/footer/footer-5";
import Seo from "../components/common/Seo";
import Header11 from "../components/header/header-11";
import NotFound from "../components/common/NotFound";

const index = () => {
  return (
    <>
      <Seo pageTitle="404" />
      <div className="header-margin"></div>
      <Header11 />
      <NotFound />
      <Footer5 />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
