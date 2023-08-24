import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from 'react-bootstrap'
import Router from "next/router";
import { API } from "../../pages/api/api"
import { useDispatch } from "react-redux";
import { addAuth } from "../../features/auth/authSlice";
import { ClipLoader } from "react-spinners";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ value: "", error: true });
  const [pwd, setPwd] = useState({ value: "", error: true });
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false);

  const override = {
    display: "block",
    margin: "0 auto"
  };

  const loginHandler = () => {
    if (checkFormData()) {
      let request = {
        email: email.value,
        password: pwd.value
      }
      getLogin(request)
    }
  }

  const checkFormData = () => {
    if (email.error && pwd.error && email.value != "" && pwd.value != "")
      return true
    else
      return false
  }

  const getLogin = async (req) => {
    setError(null)
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
      dispatch(addAuth({ type: 'userInfo', data: data.result }))
      dispatch(addAuth({ type: 'LoggedIn', data: true }))
      Router.push({ pathname: '/' })
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
    setPwd({ value: password, error: flag })
  }

  return (
    <div className="row y-gap-20">
      <ToastContainer />
      <div className="col-12">
        <h1 className="text-22 fw-500">Welcome back</h1>
        <p className="mt-10">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-blue-1">
            Sign up for free
          </Link>
        </p>
      </div>
      {/* End .col */}
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
          <Form.Control
            required
            type="password"
            value={pwd.value}
            onChange={passwordHandler}
            className="border-dark-1 form-control-lg "
            isInvalid={!pwd.error}
            style={{ borderColor: '#dddddd', borderWidth: '2px', borderStyle: 'solid' }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
      {/* <div className="col-12">
        <a href="#" className="text-14 fw-500 text-blue-1 underline">
          Forgot your password?
        </a>
      </div> */}
      {/* End .col */}
      {
        error != null ? (
          <div className="text-red-1 px-15 fw-500">
            {error}
          </div>
        ) : null
      }
      <div className="col-12">
        <button
          className={`button py-20 rounded-8 text-white w-100 ${loading ? "bg-light-1" : "-dark-1 bg-blue-1"}`}
          disabled={loading}
          onClick={loginHandler}
        >
          {
            loading ? (
              <ClipLoader
                loading={loading}
                cssOverride={override}
              />
            ) : (
              <span> Sign In <i className="icon-arrow-top-right ml-15" /></span>
            )
          }
        </button>
      </div>

      {/* End .col */}
    </div>
  );
};

export default LoginForm;
