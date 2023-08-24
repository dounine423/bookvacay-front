import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import InputRange from "react-input-range";

const PriceSlider = ({ getValue }) => {
  const { filter } = useSelector(state => state.hotel)
  const { currency, currencyInfo } = useSelector(state => state.region)
  const { request, defaultFilter } = useSelector(state => state.hotel)
  const [price, setPrice] = useState({ min: defaultFilter?.min, max: defaultFilter?.max });
  const [max, setMax] = useState(defaultFilter?.max)
  const [min, setMin] = useState(defaultFilter?.min)
  const [currentInfo, setCurInfo] = useState()

  const handleOnChange = (prices) => {
    setPrice(prices);
    let max = prices.max
    let min = prices.min
    if (currentInfo) {
      max = Math.floor(prices.max / currentInfo.client)
      min = Math.floor(prices.min / currentInfo.client)
    }
    getValue({ min, max })
  };

  useEffect(() => {
    if (currencyInfo) {
      let max = Math.floor(defaultFilter.max * currencyInfo.client)
      let min = Math.floor(defaultFilter.min * currencyInfo.client)
      setMax(max)
      setMin(min)
      let curMax = Math.floor(filter.max * currencyInfo.client)
      let curMin = Math.floor(filter.min * currencyInfo.client)
      setPrice({ max: curMax, min: curMin })
      if (JSON.stringify(currencyInfo) != JSON.stringify(currentInfo)) {
        setCurInfo(currencyInfo)
      }
    }
  }, [currencyInfo, filter])

  return (
    <div className="js-price-rangeSlider position-relative">
      {
        request ? (
          <div className="absolute" style={{ top: '10px', left: '40%' }}>
            <ClipLoader size={70} loading={true} />
          </div>
        ) : (
          price ? (<div>
            <div className="d-flex justify-between mb-20">
              <div className="text-15 text-dark-1">
                <span className="js-lower mx-1 text-18">{currency} {price?.min}</span>-
                <span className="js-upper mx-1 text-18">{currency} {price?.max}</span>
              </div>
            </div>
            <div className="px-5">
              <InputRange
                formatLabel={(value) => ``}
                minValue={min}
                maxValue={max}
                value={price}
                onChange={(value) => handleOnChange(value)}
              />
            </div>
          </div>) : null
        )
      }


    </div>
  );
};

export default PriceSlider;
