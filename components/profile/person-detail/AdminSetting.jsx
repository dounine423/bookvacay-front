
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Icon from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form } from "react-bootstrap"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { API } from '../../../pages/api/api'
import { addAuth } from "../../../features/auth/authSlice"

const AdminSetting = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)

    const [modal, setModal] = useState(false)
    const [pwd, setPwd] = useState("")
    const [hotelEnv, setHEnv] = useState(userInfo?.hotelEnv)
    const [activityEnv, setAEnv] = useState(userInfo?.activityEnv)

    const onHotelRadioChange = (e) => {
        let value = e.target.value
        setHEnv(value)
    }

    const onActivityRadioChange = (e) => {
        let value = e.target.value
        setAEnv(value)
    }

    const onHideModal = () => {
        setModal(false)
    }

    const onChangeHandler = async () => {
        setModal(false)
        let params = {
            pwd,
            email: userInfo?.email,
            hotelEnv: hotelEnv.toString(),
            activityEnv: activityEnv.toString()
        }
        const { data } = await API.post('/changeAdminSettingByAdmin', params)
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
            let params = {
                ...userInfo,
                hotelEnv,
                activityEnv
            }
            dispatch(addAuth({ type: 'userInfo', data: params }))

        } else {
            toast.error("Password is not correct", {
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
        setPwd("")
    }

    const onPwdChange = (e) => {
        let value = e.target.value
        setPwd(value)
    }

    useEffect(() => {

        console.log(userInfo)
    }, [])

    return (
        <div className="px-30 py-30" >
            <ToastContainer />
            <Modal show={modal} onHide={onHideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Admin Setting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Password *</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            value={pwd}
                            onChange={onPwdChange}
                            style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onChangeHandler}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <label className='text-20 fw-500'>Hotel Envrioment</label>
                <div className='row py-20'>
                    <div className='d-inline-flex item-center col-3'>
                        <input name="hotelEnv" checked={hotelEnv == "1" ? true : false} value="1" type='radio' onChange={onHotelRadioChange} className='form-check' style={{ height: '20px', width: '20px' }} />
                        <label className='form-check-label ml-10'> Development </label>
                    </div>
                    <div className='d-inline-flex item-center col-3'>
                        <input name='hotelEnv' checked={hotelEnv == "2" ? true : false} value="2" type='radio' onChange={onHotelRadioChange} className='form-check' style={{ height: '20px', width: '20px' }} />
                        <label className='form-check-label ml-10'> Production </label>
                    </div>
                </div>
            </div>
            <div>
                <label className='text-20 fw-500'>Activity Envrioment</label>
                <div className='row py-20'>
                    <div className='d-inline-flex item-center col-3'>
                        <input name="activityEnv" checked={activityEnv == 1 ? true : false} value="1" type='radio' onChange={onActivityRadioChange} className='form-check' style={{ height: '20px', width: '20px' }} />
                        <label className='form-check-label ml-10'> Development </label>
                    </div>
                    <div className='d-inline-flex item-center col-3'>
                        <input name='activityEnv' checked={activityEnv == 2 ? true : false} value="2" type='radio' onChange={onActivityRadioChange} className='form-check' style={{ height: '20px', width: '20px' }} />
                        <label className='form-check-label ml-10'> Production </label>
                    </div>
                </div>
            </div>
            <button onClick={() => { setModal(true) }} className="bg-blue-1 button h-50 px-24 cursor-pointer text-white mt-20 rounded-8" >
                <FontAwesomeIcon color="white" icon={Icon.faLock} className="mr-10" /> Change
            </button>

        </div>
    )
}

export default AdminSetting