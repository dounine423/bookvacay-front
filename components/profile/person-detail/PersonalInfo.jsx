import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormAPI } from "../../../pages/api/api";
import { addAuth } from "../../../features/auth/authSlice";

const PersonalInfo = () => {
  const dispatch = useDispatch()
  const uploadRef = useRef()
  const { userInfo } = useSelector(state => state.auth)
  const { countries } = useSelector(state => state.region)
  const [name, setName] = useState({ value: "", error: false })
  const [surname, setSurName] = useState({ value: "", error: false })
  const [phone, setPhone] = useState({ value: "", error: false })
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [address, setAddress] = useState("")
  const [avatar, setAvatar] = useState({ file: null, path: userInfo?.avatar })
  const [loading, setLoading] = useState(false)

  const handleNameChange = (e) => {
    let nameReg = /^[a-zA-Z]+$/;
    let name = e.target.value
    setName({ value: name, error: nameReg.test(name) })
  }

  const handleSurNameChange = (e) => {
    let nameReg = /^[a-zA-Z]+$/;
    let surname = e.target.value
    setSurName({ value: surname, error: nameReg.test(surname) })
  }

  const handlePhoneChange = (e) => {
    let phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    let phone = e.target.value.trim()
    setPhone({ value: phone, error: phoneReg.test(phone) })
  }

  const handleZipCodeChange = (e) => {
    setZipCode(e.target.value)
  }

  const handleAvatarChange = (e) => {
    let file = e.target.files[0]
    if (file)
      setAvatar({ file, path: URL.createObjectURL(file) })
  }

  const handleAddressChange = (e) => {
    setAddress(e.target.value)
  }

  const handleCountryChange = (e) => {
    let index = e.target.selectedIndex
    setCountry(countries[index].code)
  }

  const onSaveFormData = () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('id', userInfo?.id)
    formData.append('name', name.error ? name.value : "")
    formData.append('surname', surname.error ? surname.value : "")
    formData.append('phone', phone.error ? phone.value : "")
    formData.append('country', country)
    formData.append('zipcode', zipCode)
    formData.append('address', address)
    if (avatar.file)
      formData.append('avatar', avatar.file)
    sendFormData(formData)
  }

  const sendFormData = async (req) => {
    const { data } = await FormAPI.post('/modifyUserInfo', req)
    if (data.success) {
      toast.success(data.result, {
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
    } else
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
    setLoading(false)
  }

  const fileSelect = () => {
    uploadRef.current.click()
  }

  useEffect(() => {
    const { name, surname, phone, zipcode, address, country, email } = userInfo
    if (name) {
      setName({ value: name, error: true })
    }
    if (surname) {
      setSurName({ value: surname, error: true })
    }
    if (phone) {
      setPhone({ value: phone, error: true })
    }
    if (zipcode) {
      setZipCode(zipcode)
    }
    if (address) {
      setAddress(address)
    }
    if (email) {
      setEmail(email)
    }
    if (country) {
      setCountry(country)
      let cName = ""
      countries.map((item) => {
        if (item.code == country)
          cName = item.name
      })
    }
  }, [])

  return (
    <div className={"px-30 py-30 " + (loading ? " disable" : "")} >
      <ToastContainer />
      <div className="mt-20 mb-20 position-relative">
        <Image onClick={fileSelect} alt="avatar" className="rounded-8 border cursor-pointer" height={250} width={250} src={avatar?.path ? (avatar?.path) : "/img/general/default-avatar.png"} />
        <input className="d-none" ref={uploadRef} type="file" accept="image/png, image/jpeg" onChange={handleAvatarChange} />
      </div>
      <div className="row">
        <Form.Group className="col-md-6 input-group-lg mt-10" key="name">
          <Form.Label>First Name *</Form.Label>
          <Form.Control
            required
            type="text"
            value={name.value}
            isInvalid={!name.error}
            onChange={handleNameChange}
            style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a first name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="col-md-6 input-group-lg mt-10" key="surname">
          <Form.Label>Last Name *</Form.Label>
          <Form.Control
            required
            type="text"
            value={surname.value}
            isInvalid={!surname.error}
            onChange={handleSurNameChange}
            style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a last name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="col-md-6 input-group-lg mt-10" key="email">
          <Form.Label>Email *</Form.Label>
          <Form.Control
            required
            type="text"
            readOnly
            value={email}
            style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid Address.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="col-md-6 input-group-lg mt-10" key="phone">
          <Form.Label>Phone *</Form.Label>
          <Form.Control
            required
            type="text"
            value={phone.value}
            isInvalid={!phone.error}
            onChange={handlePhoneChange}
            style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a phone number.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="col-md-6 input-group-lg mt-10">
          <Form.Label>Country *</Form.Label>
          <select onChange={handleCountryChange} className="form-control text-18">
            {countries?.map((item, id) => (
              <option key={id} selected={item.code == country ? true : false} className="text-18">{item.name}</option>
            ))}

          </select>
        </Form.Group>
        <Form.Group className="col-md-6 input-group-lg mt-10" key="zipcode">
          <Form.Label>ZipCode *</Form.Label>
          <Form.Control
            required
            type="text"
            value={zipCode}
            onChange={handleZipCodeChange}
            style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
          />
        </Form.Group>
        <Form.Group className="col-md-12 col-sm-6 input-group-lg mt-10" key="address">
          <Form.Label>Address *</Form.Label>
          <Form.Control
            required
            type="text"
            value={address}
            onChange={handleAddressChange}
            style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#ced4da' }}
          />
        </Form.Group>
        <div className="col-sm-6">
          <button
            className="button h-50 px-24 -dark-1 bg-blue-1 text-white mt-20 rounded-8"
            onClick={onSaveFormData}
          >
            Save Changes <div className="icon-arrow-top-right ml-15" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
