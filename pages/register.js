import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import dynamic from "next/dynamic";
import { Form } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Seo from "../components/common/Seo";
import Header11 from "../components/header/header-11";
import Footer5 from "../components/footer/footer-5";
import { API } from "./api/api";

const SignUp = () => {

  const [email, setEmail] = useState({ value: "", error: true });
  const [password, setPassword] = useState({ value: "", error: true });
  const [view, setView] = useState(false)
  const [loading, setLoading] = useState(false)

  const emailHandler = (e) => {
    let emailReg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    let email = e.target.value
    setEmail({ value: email, error: emailReg.test(email) })
  }

  const passwordHandler = (e) => {
    let password = e.target.value
    let flag = true
    if (password.length > 7)
      flag = true
    else
      flag = false
    setPassword({ value: password, error: flag })
  }

  const viewPwd = () => {
    setView(!view)
  }

  const registerHandler = () => {
    if (checkFormData() && loading == false) {
      let params = {
        email: email.value,
        password: password.value
      }
      sendFormData(params)
    }
  }

  const sendFormData = async (req) => {
    setLoading(true)
    const { data } = await API.post('/register', req)
    if (data.success) {
      toast.success(data.message, {
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
            type: 0,
            email: email.value
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

  const checkFormData = () => {
    if (email.error && password.error && email.value != "" && password.value != "")
      return true
    else
      return false
  }

  return (
    <>
      <Seo pageTitle="Sign Up" />
      <div className="header-margin"></div>
      <Header11 />
      <ToastContainer />
      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                <div>
                  <h1 className="text-22 fw-500">Welcome back</h1>
                  <p className="mt-10">
                    Already have an account yet?{" "}
                    <Link href="/login" className="text-blue-1">
                      Log in
                    </Link>
                  </p>
                </div>
                <Form noValidate >
                  <Form.Group className="col-12">
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
                      Please provide a valid email.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="col-12">
                    <Form.Label>
                      Password
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        required
                        type={view ? "text" : "password"}
                        value={password.value}
                        onChange={passwordHandler}
                        className="border-dark-1 form-control-lg "
                        isInvalid={!password.error}
                        style={{ borderColor: '#dddddd', borderWidth: '2px', borderStyle: 'solid' }}
                      />
                      <i onClick={viewPwd} className="icon-eye absolute cursor-pointer" style={{ top: '15px', right: '15px' }} />
                    </div>

                    <Form.Control.Feedback type="invalid">
                      Please provide a valid password.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form >
                <a onClick={registerHandler} className={`button rounded-8 py-15  bg-blue-1 text-white w-100 -dark-1 ${loading ? " cursor-wait" : " cursor-pointer"}`}
                >
                  {
                    loading ? (
                      <ClipLoader size={20} color="white" />
                    ) : (
                      <span>Register</span>
                    )
                  }
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer5 />
    </>
  );
};

export default dynamic(() => Promise.resolve(SignUp), { ssr: false });
