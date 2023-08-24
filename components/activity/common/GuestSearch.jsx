import React, { useState, useEffect } from "react";

const GuestSearch = ({ getGuest, paxes }) => {
  const age = 99
  const [guest, setGuest] = useState([])

  const incrementCount = () => {
    let temp = JSON.parse(JSON.stringify(guest))
    temp.push({ age: 30 })
    setGuest([...temp])
    getGuest(temp)
  };

  const decrementCount = () => {
    let temp = JSON.parse(JSON.stringify(guest))
    if (temp.length > 0) {
      temp.pop()
      setGuest([...temp])
      getGuest(temp)
    }
  };

  const onSelectValue = (value, index) => {
    let temp = JSON.parse(JSON.stringify(guest))
    temp[index].age = parseOption(value) / 1
    setGuest([...temp])
    getGuest(temp)
  }

  const parseOption = (str) => {
    let words = str.split(' ')
    return words[0]
  }

  useEffect(() => {
    setGuest([...paxes])
  }, [])

  return (
    <div className="searchMenu-guests px-30 lg:py-20 lg:px-0 js-form-dd js-form-counters position-relative">
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
      >
        <h4 className="text-15 fw-500 ls-2 lh-16">Guest</h4>
        <div className="text-15 text-light-1 ls-2 lh-16">
          <span className="js-count-adult">{guest.length} {guest.length == 1 ? "Guest" : "Guests"}</span>
        </div>
      </div>
      {/* End guest */}

      <div className="shadow-2 dropdown-menu min-width-400">
        <div className="bg-white px-30 py-30 rounded-4 counter-box">
          <div className="row y-gap-10 justify-between items-center">
            <div className="col-auto">
              <div className="text-15 lh-12 fw-500">Guest</div>
            </div>
            {/* End .col-auto */}
            <div className="col-auto">
              <div className="d-flex items-center js-counter">
                <button
                  className="button -outline-blue-1 text-blue-1 size-38 rounded-4 js-down"
                  onClick={decrementCount}
                >
                  <i className="icon-minus text-12" />
                </button>
                {/* decrement button */}
                <div className="flex-center size-20 ml-15 mr-15">
                  <div className="text-15 js-count">{guest.length}</div>
                </div>
                {/* counter text  */}
                <button
                  className="button -outline-blue-1 text-blue-1 size-38 rounded-4 js-up"
                  onClick={incrementCount}
                >
                  <i className="icon-plus text-12" />
                </button>
                {/* increment button */}
              </div>
            </div>
            {/* End .col-auto */}
          </div>
          <div className="row mt-10 justify-center">
            {
              Array(guest.length).fill().map((_, i) => (
                <div key={i} className="col-5 px-10 mr-10 mt-10" style={{ borderColor: '#3554d1', borderStyle: 'solid', borderWidth: '2px', borderRadius: '10px' }}>
                  <select defaultValue={guest[i].age + " years old"} onChange={(e) => onSelectValue(e.target.value, i)}>
                    {
                      Array(age).fill().map((_, j) => (
                        <option key={j}>{j} years old</option>
                      ))
                    }
                  </select>
                </div>
              ))
            }
          </div>
          <div className="border-top-light mt-24 mb-24" />
        </div>
      </div>
    </div>
  );
};
export default GuestSearch;
