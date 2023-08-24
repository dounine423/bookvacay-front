import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { Form } from 'react-bootstrap'
import { API } from "../../pages/api/api"
import { ClipLoader } from "react-spinners";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [verify, setVerify] = useState(false)
  const [email, setEmail] = useState({ value: "", error: true });
  const [password, setPassword] = useState({ value: "", error: true });
  const [verifyCode, setVCode] = useState("")
  const [error, setError] = useState(null)
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "white",
  };

  const registerHandler = () => {
    if (checkFormData()) {
      let request = {
        email: email.value,
        password: password.value
      }
      sendFormData(request)
    }

  }

  const sendFormData = async (req) => {
    setLoading(true)
    setError(null)
    const { data } = await API.post('/register', req)
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
      Router.push({ pathname: '/login' })
      // setVerify(true)
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
      setError(data.message)
    }
    setLoading(false)
  }

  const veryEmail = async () => {
    setLoading(true)
    let request = {
      verifycode: verifyCode,
      email: email.value

    }
    const { data } = await API.post('/veriycode', request)
    if (data.success) {
      Router.push({ pathname: '/login' })
    } else {
      setError(data.message)
    }
    setLoading(false)
  }

  const checkFormData = () => {
    if (email.error && password.error && email.value != "" && password.value != "")
      return true
    else
      return false
  }

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

  return (
    <div>
      <div className="col-12">
        <ToastContainer />
        <h1 className="text-22 fw-500">Welcome back</h1>
        <p className="mt-10">
          Already have an account yet?{" "}
          <Link href="/login" className="text-blue-1">
            Log in
          </Link>
        </p>
      </div>
      <Form noValidate >
        {
          verify ? (
            <Form.Group className="col-12">
              <Form.Label>
                Verify Code
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={verifyCode}
                onChange={(e) => setVCode(e.target.value)}
                className="border-dark-1 form-control-lg "
                maxLength="6"
                minLength="6"
                style={{ borderColor: '#dddddd', borderWidth: '2px', borderStyle: 'solid' }}
              />
            </Form.Group>
          ) : (
            <div className="row mt-10">
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
                <Form.Control
                  required
                  type="password"
                  value={password.value}
                  onChange={passwordHandler}
                  className="border-dark-1 form-control-lg "
                  isInvalid={!password.error}
                  style={{ borderColor: '#dddddd', borderWidth: '2px', borderStyle: 'solid' }}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          )
        }

      </Form >
      {
        error != null ? (
          <div className="text-red-1 px-15 mt-10">
            {error}
          </div>
        ) : null
      }
      <div className="col-12 mt-20">
        {
          verify ? (
            <button
              className={`button rounded-8 py-15 bg-blue-1  text-white w-100 ${loading ? "" : "-dark-1 "}`}
              disabled={loading}
              onClick={veryEmail}
            >
              {
                loading ? (
                  <ClipLoader
                    loading={loading}
                    cssOverride={override}
                  />
                ) : (
                  <span>
                    Send <i className="icon-arrow-top-right ml-15" />
                  </span>
                )
              }

            </button>
          ) : (
            <button
              className={`button rounded-8 py-15  bg-blue-1 text-white w-100 ${loading ? "" : "-dark-1"}`}
              disabled={loading}
              onClick={registerHandler}
            >
              {
                loading ? (
                  <ClipLoader
                    loading={loading}
                    cssOverride={override}
                  />
                ) : (
                  <span>
                    Register <i className="icon-arrow-top-right ml-15" />
                  </span>
                )
              }

            </button>
          )
        }

      </div>
    </div >
  );
};

export default SignUpForm;
