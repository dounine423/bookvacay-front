import { useState } from "react"
import Seo from "../components/common/Seo";
import Header11 from "../components/header/header-11";
import Footer5 from "../components/footer/footer-5";
import TermsConent from '../components/common/TermsConent'

const Term = () => {
    return (
        <>
            <Seo pageTitle="Terms & Conditions" />
            <div className="header-margin"></div>
            <Header11 />
            <section className="layout-pt-lg layout-pb-lg">
                <div className="container">
                    <div className="tabs js-tabs">
                        <TermsConent />
                    </div>
                </div>
            </section>
            <Footer5 />
        </>

    )
}

export default Term