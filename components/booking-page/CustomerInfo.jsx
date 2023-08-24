import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import ActivityBookingDetail from './sidebar/ActivityBookingDetail'
import BookingDetails from "./sidebar/HotelBookingDetails";
import { Form } from 'react-bootstrap';
import { holderOperation } from "../../features/holder/holderSlice";


const CustomerInfo = ({ nextFunction }) => {

  const dispatch = useDispatch()
  const { hotelReserve } = useSelector(state => state.hotel)
  const { activityReserve } = useSelector(state => state.activity)
  const { countries } = useSelector(state => state.region)
  const { LoggedIn, userInfo } = useSelector(state => state.auth)

  const [validated, setValidated] = useState(false);
  const [firstN, setFirstN] = useState({ value: "", error: false })
  const [lastN, setLastN] = useState({ value: "", error: false })
  const [phone, setPhone] = useState({ value: "", error: false })
  const [email, setEmail] = useState({ value: "", error: false })
  const [country, setCountry] = useState("")
  const [countryName, setCName] = useState("")
  const [address, setAddress] = useState({ value: "", error: false })
  const [zip, setZip] = useState({ value: "", error: false })
  const [mailFlag, setMailFlag] = useState(false)

  const handleFNameChange = (e) => {
    let nameReg = /^[a-zA-Z]+$/;
    let fName = e.target.value
    setFirstN({ value: fName, error: nameReg.test(fName) })
    setValidated(nameReg.test(fName))
  }

  const handleLNameChange = (e) => {
    let nameReg = /^[a-zA-Z]+$/;
    let lName = e.target.value
    setLastN({ value: lName, error: nameReg.test(lName) })
    setValidated(nameReg.test(lName))
  }

  const handleEmailChange = (e) => {
    let emailReg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    let email = e.target.value
    setEmail({ value: email, error: emailReg.test(email) })
    setValidated(emailReg.test(email))
  }

  const handlePhoneChange = (e) => {
    let phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    let phone = e.target.value
    setPhone({ value: phone, error: phoneReg.test(phone) })
    setValidated(phoneReg.test(phone))
  }

  const handleCountryChange = (e) => {
    let index = e.target.selectedIndex
    setCountry(countries[index].code)
  }

  const handleZipChange = (e) => {
    let zip = e.target.value
    setZip({ value: zip, error: e.target.checkValidity() })
    setValidated(e.target.checkValidity())
  }

  const handleAddressChange = (e) => {
    let address = e.target.value
    setAddress({ value: address, error: e.target.checkValidity() })
    setValidated(e.target.checkValidity())
  }

  const onNextStep = () => {
    let flag = checkError()
    if (flag) {
      saveHolderData()
      nextFunction()
    }
  }

  const checkError = () => {
    let result = 1;
    if (!firstN.error)
      result *= 0
    if (!lastN.error)
      result *= 0
    if (!email.error)
      result *= 0
    if (!phone.error)
      result *= 0
    if (!zip.error)
      result *= 0
    if (!address.error)
      result *= 0
    return result
  }

  const saveHolderData = () => {
    let holder = {
      name: firstN.value,
      surname: lastN.value,
      email: email.value,
      phone: phone.value,
      country: country,
      zipCode: zip.value,
      address: address.value,
      mail: mailFlag,
      mailUpdate: "2014-06-06"
    }
    dispatch(holderOperation({ type: 'holder_info', data: holder }))
  }

  const getCountryName = () => {
    return countryName
  }

  useEffect(() => {
    if (userInfo == null) {
      return
    }
    const { name, surname, phone, zipcode, address, country, email } = userInfo
    if (name) {
      setFirstN({ value: name, error: true })
    }
    if (surname) {
      setLastN({ value: surname, error: true })
    }
    if (phone) {
      setPhone({ value: phone, error: true })
    }
    if (zipcode) {
      setZip({ value: zipcode, error: true })
    }
    if (address) {
      setAddress({ value: address, error: true })
    }
    if (email) {
      setEmail({ value: email, error: true })
    }
    if (country) {
      setCountry(country)
      let cName = ""
      countries.map((item) => {
        if (item.code == country)
          cName = item.name
      })
      setCName(cName)
    }
  }, [])

  return (
    <div className="row">
      <div className="col-xl-5 col-lg-4 mt-30">
        <div className="booking-sidebar">
          {
            hotelReserve != null ? (<BookingDetails hotelData={hotelReserve} />) : null
          }
          <div className="mt-20" />
          {
            activityReserve.length > 0 ? (
              <ActivityBookingDetail activtyData={activityReserve} />
            ) : null
          }
        </div>
      </div>
      <div className="col-xl-7 col-lg-8 mt-30">
        {
          LoggedIn ? null : (
            <div className="py-15 px-20 mt-10 rounded-4 text-15 bg-blue-1-05 mb-10">
              <Link href="/login" className="text-blue-1 fw-500">
                Log in
              </Link>{" "}
              to book with your saved details or{" "}
              <Link href="/register" className="text-blue-1 fw-500">
                register
              </Link>{" "}
              to manage your bookings on the go!
            </div>
          )
        }
        <div className="rounded-8 bg-blue-2 px-30 py-20">
          <h3 className=" fw-500 mt-20 text-18 md:mt-20 mb-20">
            Enter your details
          </h3>
          <div className="text-green-2  mb-10">Almost done! Just fill in the * required info</div>
          <Form noValidate validated={validated}>
            <div className="row x-gap-20 y-gap-20 text-15">
              <Form.Group className="col-md-6" key="firstname">
                <Form.Label>Frist Name *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={firstN.value}
                  onChange={handleFNameChange}
                  isInvalid={!firstN.error}
                  className="bg-white"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid first name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6" key="lastname" >
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={lastN.value}
                  onChange={handleLNameChange}
                  isInvalid={!lastN.error}
                  className="bg-white"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a last name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6" key="email">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  required
                  type="email"
                  value={email.value}
                  onChange={handleEmailChange}
                  isInvalid={!email.error}
                  className="bg-white"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email address.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6" key="phone">
                <Form.Label>Phone *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={phone.value}
                  onChange={handlePhoneChange}
                  isInvalid={!phone.error}
                  className="bg-white"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid phone number.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6" key="country">
                <Form.Label>Country *</Form.Label>
                <select onChange={handleCountryChange} defaultValue={countryName} className="form-control"
                >
                  {
                    countries?.map((item, id) => (
                      <option selected={item.code == country ? true : false} value={item.name} key={id}>{item.name}</option>
                    ))
                  }
                </select>
              </Form.Group>
              <Form.Group className="col-md-6" key="zipcode">
                <Form.Label>ZipCode *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={zip.value}
                  onChange={handleZipChange}
                  isInvalid={!zip.error}
                  className="bg-white"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Zip Code.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-12" key="address">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={address.value}
                  onChange={handleAddressChange}
                  isInvalid={!address.error}
                  className="bg-white"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Address.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </Form>
          <div className="d-inline-block mt-10">
            <input type="checkbox" className="mr-10 " style={{ height: '16px', width: '16px' }} checked={mailFlag} onChange={() => setMailFlag(!mailFlag)} />
            <label className="text-16" >I accept to recieve information via email </label >
          </div>
        </div>
        <div className="d-flex justify-end mt-20">
          <button
            className={"button rounded-8 h-60 px-24 -dark-1  bg-blue-1 text-white text-18"}
            onClick={onNextStep}
          >
            Next <div className="icon-arrow-top-right ml-15" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomerInfo;
