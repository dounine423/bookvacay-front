import { useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import { Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import Seo from "../components/common/Seo";
import Header11 from "../components/header/header-11";
import Footer5 from "../components/footer/footer-5";
import { API } from "./api/api";

const ResetPwd = () => {
    const router = useRouter()
    const { query } = router
    const email = query.email
    const code = query.code
    const [pwd, setPwd] = useState("")
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(false)

    const pwdChangeHandler = (e) => {
        let value = e.target.value
        setPwd(value)
    }

    const viewPwdHandler = () => {
        setView(!view)
    }

    const resetPwdAction = async () => {
        if (pwd.length > 3) {
            let params = {
                email,
                pwd,
                code
            }
            const { data } = await API.post('/resetPwd', params)
            if (data.success) {
                toast.success('Success', {
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
                    Router.push({ pathname: '/login' })
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
                                    <h1 className="text-22 fw-500">Reset Password</h1>
                                </div>
                                <Form noValidate >
                                    <Form.Group className="col-12 ">
                                        <Form.Label>
                                            Password
                                        </Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                required
                                                type={view ? "text" : "password"}
                                                value={pwd}
                                                onChange={pwdChangeHandler}
                                                className="border-dark-1 form-control-lg "
                                                style={{ borderColor: '#dddddd', borderWidth: '2px', borderStyle: 'solid' }}
                                            />
                                            <i onClick={viewPwdHandler} className="absolute icon-eye cursor-pointer" style={{ top: '15px', right: '15px' }} />
                                        </div>
                                    </Form.Group>
                                </Form>
                                <div className="d-flex justify-end mt-20 items-center">
                                    <a
                                        className={`button py-15 rounded-8 w-100 text-white px-20 -dark-1 bg-blue-1 ${loading ? " cursor-wait" : " cursor-pointer"}`}
                                        onClick={resetPwdAction}
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

export default ResetPwd