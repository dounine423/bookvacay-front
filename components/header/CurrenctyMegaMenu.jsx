import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import { regionAction } from "../../features/region/region";
import { API } from "../../pages/api/api";

const CurrenctyMegaMenu = ({ textClass, onChangeCurrency }) => {
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const { currencies, currency } = useSelector(state => state.region)

  const handleCurrency = () => {
    setModal(!modal)
  }

  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const handleItemClick = async (item) => {
    if (onChangeCurrency) {
      if (item.code == currency) {
        setModal(false)
        return
      }
      const { data } = await API.post('/')
      dispatch(regionAction({ type: 'currency', data: item.code }))
      setSelectedCurrency(item.code);
      setModal(false)
      onChangeCurrency(item.code)
    } else {
      setModal(false)
    }

  };

  const hideModal = () => {
    setModal(false)
  }

  return (
    <>
      <div className="col-auto">
        <button
          className={`d-flex items-center text-14 ${textClass}`}
          onClick={handleCurrency}
        >
          <span className="js-currencyMenu-mainTitle fw-500 text-18">
            {selectedCurrency}
          </span>
          <i className="icon-chevron-sm-down text-7 ml-10" />
        </button>
      </div>
      <Modal show={modal} onHide={hideModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Select Currency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row px-30 py-20">
            {
              currencies?.map((item, id) => (
                <div key={id} className={`col-xl-3 px-20 py-10 ${selectedCurrency === item?.code ? "text-blue-1" : ""}`} onClick={() => handleItemClick(item)}>
                  <div>
                    {item.content}
                    {
                      item.code == selectedCurrency ? (<i className="icon-check ml-10 text-blue-1" />) : null
                    }
                  </div>
                  <div>
                    {item.code}
                  </div>

                </div>
              ))
            }
          </div>
        </Modal.Body>
      </Modal>
      {/* <div
        className={`currencyMenu js-currencyMenu ${click ? "" : "is-hidden"}`}
      >
        <div className="currencyMenu__bg" onClick={handleCurrency}></div>
        <div className="currencyMenu__content bg-white rounded-4">
          <div className="d-flex items-center justify-between px-30 py-20 sm:px-15 border-bottom-light">
            <div className="text-20 fw-500 lh-15">Select your currency</div>
            <button className="pointer" onClick={handleCurrency}>
              <i className="icon-close" />
            </button>
          </div>
          <div className="row  px-30 py-30 sm:px-15 sm:py-15 scroll-y">
            {currencyData?.map((item, id) => (
              <div
                className={`col-3 ${selectedCurrency?.code === item?.code ? "active" : ""
                  }`}
                key={id}
                onClick={() => handleItemClick(item)}
              >
                <div className="text-15  fw-500 text-dark-1">
                  {item?.content}
                </div>
                <div className="text-14 mt-5">
                  <span className="js-title">{item?.code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default CurrenctyMegaMenu;
