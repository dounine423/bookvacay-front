import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import Link from "next/link";
import Router from "next/router";
import { Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import Seo from "../components/common/Seo";
import Header11 from "../components/header/header-11";
import Footer5 from "../components/footer/footer-5";
import { API } from './api/api'
import { addAuth } from "../features/auth/authSlice";
import { regionAction } from "../features/region/region";

const LogIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ value: "", error: true });
  const [pwd, setPwd] = useState({ value: "", error: true });
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(false)

  const loginHandler = () => {
    if (checkFormData() && loading == false) {
      let params = {
        email: email.value,
        password: pwd.value
      }
      getLogin(params)
    }
  }

  const checkFormData = () => {
    if (email.error && pwd.error && email.value != "" && pwd.value != "")
      return true
    else
      return false
  }

  const getLogin = async (req) => {
    setLoading(true)
    const { data } = await API.post('/login', req)
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
      const { country, destination, facility, currency, currencyInfo } = data.result.region
      dispatch(addAuth({ type: 'userInfo', data: data.result.userData }))
      dispatch(addAuth({ type: 'LoggedIn', data: true }))
      dispatch(regionAction({ type: 'destinations', data: destination }))
      dispatch(regionAction({ type: 'countries', data: country }))
      dispatch(regionAction({ type: 'facilities', data: facility }))
      dispatch(regionAction({ type: 'currencies', data: currency }))
      dispatch(regionAction({ type: 'currencyInfo', data: currencyInfo }))
      setTimeout(() => {
        Router.push({ pathname: '/' })
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
      if (data.code == 2) {
        setTimeout(() => {
          Router.push({
            pathname: '/verifyCode',
            query: {
              email: email.value,
              type: 0
            }
          })
        }, 2500)

      }
    }
    setLoading(false)
  }

  const emailHandler = (e) => {
    let emailReg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    let email = e.target.value
    setEmail({ value: email, error: emailReg.test(email) })
  }

  const passwordHandler = (e) => {
    let password = e.target.value
    // let flag = true
    // if (password.length > 7)
    //   flag = true
    // else
    //   flag = false
    setPwd({ value: password, error: true })
  }

  const viewPassword = () => {
    setView(!view)
  }

  useEffect(() => {
    // let dateTime = "2023-08-16T12:34:56Z"
    // let date = new Date(dateTime)
    // const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    // let local = date.toLocaleDateString(undefined, options)
    // console.log(local)
  }, [])

  return (
    <>
      <Seo pageTitle="Login" />
      <div className="header-margin"></div>
      <Header11 />
      <ToastContainer />
      <section className="layout-pt-lg   layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                <div className="col-12">
                  <h1 className="text-22 fw-500">Welcome back</h1>
                  <p className="mt-10">
                    Don&apos;t have an account yet?{" "}
                    <Link href="/register" className="text-blue-1">
                      Sign up for free
                    </Link>
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
                  <Form.Group className="col-12 ">
                    <Form.Label>
                      Password
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        required
                        type={view ? "text" : "password"}
                        value={pwd.value}
                        onChange={passwordHandler}
                        className="border-dark-1 form-control-lg "
                        isInvalid={!pwd.error}
                        style={{ borderColor: '#dddddd', borderWidth: '2px', borderStyle: 'solid' }}
                      />
                      <i className="icon-eye position-absolute cursor-pointer" style={{ right: '15px', top: '15px' }} onClick={viewPassword} />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid password.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form>
                <div className="d-flex justify-end mt-20 items-center">
                  <p className="text-blue-1 text-18 fw-500 px-10 cursor-pointer"><Link href="/forgotPwd" className="text-blue-1">Forgot my password</Link> </p>
                  <a
                    className={`button py-15 rounded-8 text-white px-20 -dark-1 bg-blue-1 ${loading ? " cursor-wait" : " cursor-pointer"}`}
                    onClick={loginHandler}
                  >
                    {
                      loading ? (
                        <ClipLoader loading={true} color="white" size={18} />
                      ) : (
                        <span>Login</span>
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
  );
};

export default dynamic(() => Promise.resolve(LogIn), { ssr: false });
