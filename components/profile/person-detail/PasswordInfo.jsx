import { useState } from "react";
import { useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API } from "../../../pages/api/api";

const PasswordInfo = () => {

  const { userInfo } = useSelector(state => state.auth)

  const [curPwd, setCurPwd] = useState({ value: "", error: true })
  const [newPwd, setNewPwd] = useState({ value: "", error: true })
  const [conPwd, setConPwd] = useState({ value: "", error: true })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(true)

  const disable = {
    pointerEvents: 'none',
    opacity: 0.4,
  }

  const newPwdChange = (e) => {
    let value = e.target.value
    if (value.length < 8) {
      setNewPwd({ value, error: false })
      setStatus(true)
    }
    else {
      setNewPwd({ value, error: true })
      if (value == conPwd.value)
        setStatus(false)
      else
        setStatus(true)
    }
  }

  const conPwdChange = (e) => {
    let value = e.target.value
    if (value.length < 8) {
      setConPwd({ value, error: false })
      setStatus(true)
    }
    else {
      setConPwd({ value, error: true })
      if (value == newPwd.value)
        setStatus(false)
      else
        setStatus(true)
    }
  }

  const onchangePwd = async () => {
    setLoading(true)
    let pwds = {
      curPwd: curPwd.value,
      newPwd: newPwd.value,
      id: userInfo?.id
    }
    const { data } = await API.post('/changePwd', pwds)
    if (data.success) {
      toast.success(data.result, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } else {
      toast.error(data.result, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setCurPwd({ value: "", error: false })
    }
    setLoading(false)
  }


  return (
    <div className="px-30 py-50" style={loading ? disable : null}>
      <ToastContainer />
      <Form.Group className="input-container">
        <Form.Label>Current Password</Form.Label>
        <Form.Control
          required
          type="password"
          value={curPwd.value}
          isInvalid={!curPwd.error}
          onChange={(e) => { setCurPwd({ value: e.target.value, error: true }) }}
          style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
        />
        <Form.Control.Feedback type="invalid">
          Password is not correct
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mt-20 input-container">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          required
          type="password"
          value={newPwd.value}
          isInvalid={!newPwd.error}
          onChange={(e) => { newPwdChange(e) }}
          style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
        />
        <Form.Control.Feedback type="invalid">
          Password length must be bigger than 8
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mt-20">
        <Form.Label>New Password Again</Form.Label>
        <Form.Control
          required
          type="password"
          value={conPwd.value}
          isInvalid={!conPwd.error}
          onChange={(e) => { conPwdChange(e) }}
          style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
        />
        <Form.Control.Feedback type="invalid">
          Password length must be bigger than 8
        </Form.Control.Feedback>
      </Form.Group>
      <button disabled={status} onClick={onchangePwd} className={(status ? "bg-blue-2" : "bg-blue-1") + (" button h-50 px-24 cursor-pointer text-white mt-20 rounded-8")} >
        Change Password <div className="icon-arrow-top-right ml-15" />
      </button>
    </div>

  );
};

export default PasswordInfo;
