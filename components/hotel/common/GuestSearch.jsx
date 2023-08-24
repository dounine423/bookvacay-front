import React, { useEffect, useState } from "react";

const Counter = ({ name, defaultValue, onCounterChange, getChildren, childAge, getAdults, adultAge }) => {
  const [count, setCount] = useState(defaultValue);
  const [children, setChildren] = useState([...childAge])
  const [adults, setAdults] = useState([...adultAge])
  const age = 17
  const maxAge = 99

  const incrementCount = () => {
    if (name == "Adults") {
      let temp = [...adults]
      temp.push({ age: 30 })
      setAdults([...temp])
      getAdults(temp)
    }
    if (name == "Children") {
      let temp = [...children]
      temp.push({ type: "CH", age: 5 })
      setChildren([...temp])
      getChildren(temp)
    }
    setCount(+count + +1);
    onCounterChange(name, +count + +1);

  };
  const decrementCount = () => {
    if (count > 0) {
      if (name == "Adults") {
        let temp = [...adults]
        temp.pop()
        setAdults([...temp])
        getAdults(temp)
      }
      if (name == "Children") {
        let temp = [...children]
        temp.pop()
        setChildren([...temp])
        getChildren(temp)
      }
      setCount(count - 1);
      onCounterChange(name, +count - +1);
    }
  };

  const onSelectValue = (value, index, type) => {
    if (type == 1) {
      let temp = [...children]
      temp[index] = { type: "CH", age: parseOption(value) / 1 }
      setChildren([...temp])
      getChildren(temp)
    } else if (type == 2) {
      let temp = [...adults]
      temp[index] = { age: parseOption(value) / 1 }
      setAdults([...temp])
      getAdults(temp)
    }

  }

  const parseOption = (str) => {
    let tokens = str.split(' ')
    return tokens[0]
  }

  return (
    <>
      <div className="row y-gap-10 justify-between items-center">
        <div className="col-auto">
          <div className="text-15 lh-12 fw-500">{name}</div>
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
              <div className="text-15 js-count">{count}</div>
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
      {/* End .row */}
      <div className="row mt-15 justify-center">
        {name === "Children" && (
          Array(count).fill().map((_, i) => (
            <div key={i} className="col-5 px-10 mr-10 mt-10" style={{ borderColor: '#3554d1', borderStyle: 'solid', borderWidth: '2px', borderRadius: '10px' }}>
              <select defaultValue={children[i]?.age + " years old"} onChange={(e) => onSelectValue(e.target.value, i, 1)}>
                {
                  Array(age).fill().map((_, j) => (
                    <option key={j}>{j + 1} years old</option>
                  ))
                }
              </select>
            </div>
          ))
        )}
      </div>
      <div className="row mt-15 justify-center">
        {name === "Adults" && (
          Array(count).fill().map((_, i) => (
            <div key={i} className="col-5 px-10 mr-10 mt-10" style={{ borderColor: '#3554d1', borderStyle: 'solid', borderWidth: '2px', borderRadius: '10px' }}>
              <select defaultValue={adults[i]?.age + " years old"} onChange={(e) => onSelectValue(e.target.value, i, 2)}>
                {
                  Array(maxAge).fill().slice(17).map((item, j) => (
                    <option key={j}>{j + 17} years old {item}</option>
                  ))
                }
              </select>
            </div>
          ))
        )}
      </div>
      <div className="border-top-light mt-24 mb-24" />
    </>
  );
};

const GuestSearch = ({ getChildAge, getGuest, guest, childAge, getAdultAge, adultAge }) => {

  const counters = [
    { name: "Adults", defaultValue: guest?.Adults },
    { name: "Children", defaultValue: guest?.Children },
    { name: "Rooms", defaultValue: guest?.Rooms },
  ];

  const [guestCounts, setGuestCounts] = useState({
    Adults: guest?.Adults,
    Children: guest?.Children,
    Rooms: guest?.Rooms,
  });
  const [children, setChildren] = useState(childAge)
  const [adults, setAdults] = useState(adultAge)

  const handleCounterChange = (name, value) => {
    setGuestCounts((prevState) => ({ ...prevState, [name]: value }));
    let guest = {
      ...guestCounts,
      [name]: value
    }
    getGuest(guest)
  };

  useEffect(() => {
    getChildAge(children)
    getAdultAge(adults)
  }, [children, adults])
  return (
    <div className="searchMenu-guests py-10 lg:py-20  js-form-dd js-form-counters position-relative">
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
      >
        <h4 className="text-15 fw-500 ls-2 lh-16 px-20">Guest</h4>
        <div className="text-15 text-light-1 ls-2 lh-16 px-20">
          <span className="js-count-adult">{guestCounts.Adults}</span> adults -{" "}
          <span className="js-count-child">{guestCounts.Children}</span>{" "}
          childeren- <span className="js-count-room">{guestCounts.Rooms}</span>{" "}
          room
        </div>
      </div>
      {/* End guest */}

      <div className="shadow-2 dropdown-menu min-width-400">
        <div className="bg-white px-30 py-30 rounded-4 counter-box">
          {counters.map((counter) => (
            <Counter
              key={counter.name}
              name={counter.name}
              defaultValue={counter.defaultValue}
              onCounterChange={handleCounterChange}
              getChildren={setChildren}
              getAdults={setAdults}
              adultAge={adults}
              childAge={children}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default GuestSearch;
