import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from "next/router";
import Seo from "../../components/common/Seo";
import Header11 from "../../components/header/header-11";
import Footer5 from "../../components/footer/footer-5";
import HotelBookingInfo from "../../components/checkout/HotelBookingInfo";
import ActivityBookingInfo from "../../components/checkout/ActivityBookingInfo"
import { API } from "../api/api";
import { regionAction } from "../../features/region/region";

const index = () => {
    const dispatch = useDispatch()
    const { LoggedIn } = useSelector(state => state.auth)
    const { hotelBook } = useSelector(state => state.hotel)
    const { activityBook } = useSelector(state => state.activity)
    const { holder_info } = useSelector(state => state.holder)
    const { countries } = useSelector(state => state.region)
    const [holder, setHolder] = useState(null)

    const getCountry = (code) => {
        if (code == null || code == "")
            return ""
        if (countries != null) {
            let country = countries?.find((item) => {
                return item.code == code
            })
            if (country == null) {
                return ""
            } else {
                return country.name
            }

        } else {
            return ""
        }

    }

    const onChangeCurrencyHandler = async (currency) => {
        const { data } = await API.post('getCurrentCurrency', currency)
        if (data.success) {
            dispatch(regionAction({ type: 'currencyInfo', data: data.result }))
        } else {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    useEffect(() => {
        if (LoggedIn == false) {
            Router.push({ pathname: '/login' })
        } else {
            setHolder(holder_info)
        }
    }, [LoggedIn])

    return (
        <>
            <Seo pageTitle="CheckOut" />
            <div className="header-margin"></div>
            <Header11 />
            <ToastContainer />
            <div className="col-xl-12 col-lg-8 pt-40 px-20 py-20">
                <div className="order-completed-wrapper">
                    <div className="d-flex flex-column items-center mt-40 lg:md-40 sm:mt-24">
                        <div className="size-80 flex-center rounded-full bg-dark-3">
                            <i className="icon-check text-30 text-white" />
                        </div>
                        <div className="text-30 lh-1 fw-600 mt-20">
                            System, your order was submitted successfully!
                        </div>
                        <div className="text-15 text-light-1 mt-10">
                            {/* Booking details has been sent to: admin@bookvacay.online */}
                        </div>
                    </div>
                    <div id="booking-data" >
                        <div className="border-light rounded-8 px-50 py-40 mt-40">
                            <h4 className="text-20 fw-500 mb-30">Your Information</h4>
                            <div className="row y-gap-10">
                                <div className="col-12">
                                    <div className="d-flex justify-between ">
                                        <div className="text-15 lh-16">First name</div>
                                        <div className="text-15 lh-16 fw-500 text-blue-1">{holder?.name}</div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-between border-top-light pt-10">
                                        <div className="text-15 lh-16">Last name</div>
                                        <div className="text-15 lh-16 fw-500 text-blue-1">{holder?.surname}</div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-between border-top-light pt-10">
                                        <div className="text-15 lh-16">Email</div>
                                        <div className="text-15 lh-16 fw-500 text-blue-1">
                                            {holder?.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-between border-top-light pt-10">
                                        <div className="text-15 lh-16">Phone</div>
                                        <div className="text-15 lh-16 fw-500 text-blue-1">
                                            {holder?.phone}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-between border-top-light pt-10">
                                        <div className="text-15 lh-16">Address</div>
                                        <div className="text-15 lh-16 fw-500 text-blue-1">{holder?.address}</div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-between border-top-light pt-10">
                                        <div className="text-15 lh-16">ZIP code/Postal code</div>
                                        <div className="text-15 lh-16 fw-500 text-blue-1">{holder?.zipCode}</div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex justify-between border-top-light pt-10">
                                        <div className="text-15 lh-16">Country</div>
                                        <div className="text-15 lh-16 fw-500 text-blue-1">
                                            {getCountry(holder?.country)}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            hotelBook != null ? (
                                <div className="mt-20">
                                    <HotelBookingInfo hotelBookingData={hotelBook} />
                                </div>
                            ) : null
                        }
                        {
                            activityBook != null ? (
                                <div className="mt-20">
                                    <ActivityBookingInfo activitiyBookingData={activityBook} />
                                </div>
                            ) : null
                        }

                    </div>
                </div>
            </div >
            <Footer5 />
        </>
    );
};

export default index;
