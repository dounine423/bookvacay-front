import { useState } from "react";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";
import Router from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import Seo from "../components/common/Seo";
import Header11 from "../components/header/header-11";
import Footer5 from "../components/footer/footer-5";
import { API } from "./api/api";

const VerifyCode = () => {
    const router = useRouter()
    const { query } = router
    const email = query.email
    const type = query.type
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)

    const onCodeChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCode(value)
    }

    const onVerifyCodeHandler = async () => {
        if (code.length == 6 && email && type && loading == false) {
            setLoading(true)
            let params = {
                code,
                email,
                type
            }
            const { data } = await API.post('/veriycode', params)
            if (data.success) {
                toast.success("Success", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                if (String(type) == '0')
                    setTimeout(() => {
                        Router.push({ pathname: '/login' })
                    }, [2500])
                else
                    setTimeout(() => {
                        Router.push({ pathname: '/resetPwd', query: { email, code } })
                    }, [2500])
                setCode("")
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
    }

    const reSendCodeHandler = async () => {
        let params = {
            email,
            type
        }
        const { data } = await API.post('/resendVerifyCode', params)
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
                                    <h1 className="text-22 fw-500">Verification Code 6 digits</h1>
                                </div>
                                <Form noValidate >
                                    <Form.Group className="col-12 ">
                                        <Form.Label>
                                            Code
                                        </Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            maxLength={6}
                                            value={code}
                                            onChange={onCodeChange}
                                            className="border-dark-1 form-control-lg "
                                            style={{ borderColor: '#dddddd', borderWidth: '2px', borderStyle: 'solid' }}
                                        />
                                    </Form.Group>
                                </Form>
                                <div className="d-flex justify-end mt-20 items-center">
                                    <p onClick={reSendCodeHandler} className="text-18 text-blue-1 px-15 fw-500 cursor-pointer">Resend</p>
                                    <a
                                        className={`button py-15 rounded-8 text-white px-20 -dark-1 bg-blue-1 ${loading ? " cursor-wait" : " cursor-pointer"}`}
                                        onClick={onVerifyCodeHandler}
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

export default VerifyCode