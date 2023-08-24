import { useState } from "react";
import { Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import Router from "next/router";
import Seo from "../components/common/Seo";
import Header11 from "../components/header/header-11";
import Footer5 from "../components/footer/footer-5";
import { API } from './api/api'

const Forgot = () => {
    const [email, setEmail] = useState({ value: "", error: true });
    const [loading, setLoading] = useState(false)

    const emailHandler = (e) => {
        let emailReg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        let email = e.target.value
        setEmail({ value: email, error: emailReg.test(email) })
    }

    const forgotPwdHandler = () => {
        if (email.error && email.value != "") {
            sendRequestHandler()
        }
    }

    const sendRequestHandler = async () => {
        setLoading(true)
        let params = {
            email: email.value
        }
        const { data } = await API.post('/forgotPwd', params)
        if (data.success) {
            toast.info("Code has been sent your email", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                Router.push({
                    pathname: '/verifyCode',
                    query: {
                        email: email.value,
                        type: 1
                    }
                })
            }, 2500)
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
        setLoading(false)
    }

    return (
        <>
            <Seo pageTitle="Forgot Password" />
            <div className="header-margin"></div>
            <Header11 />
            <ToastContainer />
            <section className="layout-pt-lg   layout-pb-lg bg-blue-2">
                <div className="container">
                    <div className="row justify-center">
                        <div className="col-xl-6 col-lg-7 col-md-9">
                            <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                                <div className="col-12 py-15">
                                    <h1 className="text-22 fw-500">Forgotten your password?</h1>
                                    <p className="mt-10">
                                        Don't worry, it happens! Simply enter your email below and we'll send you an email with instructions for resetting your password.
                                    </p>
                                </div>
                                <Form noValidate >
                                    <Form.Group className="col-12 ">
                                        <Form.Label>
                                            Email
                                        </Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={email.value}
                                            onChange={emailHandler}
                                            className="border-dark-1 form-control-lg "
                                            isInvalid={!email.error}
                                            style={{ borderColor: '#dddddd', borderWidth: '2px', borderStyle: 'solid' }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid email address.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                                <div className="d-flex justify-end mt-20 items-center">
                                    <a
                                        className={`button py-15 rounded-8 w-100 text-white px-20 -dark-1 bg-blue-1 ${loading ? " cursor-wait" : " cursor-pointer"}`}
                                        disabled={loading}
                                        onClick={forgotPwdHandler}
                                    >
                                        {
                                            loading ? (
                                                <ClipLoader loading={true} color="white" size={18} />
                                            ) : (
                                                <span>Send</span>
                                            )
                                        }
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer5 />
        </>
    )
}

export default Forgot