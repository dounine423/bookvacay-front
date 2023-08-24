import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const AmenitiesFilter = ({ getBoard }) => {
  const { board } = useSelector(state => state.hotel.filter)

  const boardValues = [
    { name: "Room Only", code: 'RO', checked: false },
    { name: "Self Catering", code: 'SC', checked: false },
    { name: "Bed And Breakfast", code: 'BB', checked: false },
    { name: "Lunch Included", code: 'CO', checked: false },
    { name: "Dinner Included", code: 'CE', checked: false },
  ]
  const [boards, setBoard] = useState([...boardValues])

  const onHandleClick = (id) => {
    let curBoards = [...boards]
    let retBoards = [...board]
    let flag = curBoards[id]
    curBoards[id] = {
      ...curBoards[id],
      checked: !curBoards[id].checked
    }
    setBoard([...curBoards])
    if (flag.checked) {
      retBoards = retBoards.filter((item) => {
        return item.code != flag.code
      })
    } else {
      retBoards.push({ id, code: boardValues[id].code })
    }
    getBoard(retBoards)
  }

  useEffect(() => {
    let temp = [...boardValues]
    board.map((item) => {
      temp[item.id] = {
        ...temp[item.id],
        checked: true
      }
    })
    setBoard([...temp])
  }, [board])

  return (
    <>
      {boards.map((amenity, index) => (
        <div className="row y-gap-10 items-center justify-between" key={index}>
          <div className="col-auto">
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" value={amenity.code} checked={amenity.checked} onChange={(e) => onHandleClick(index)} />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-15 ml-10">{amenity.name}</div>
            </div>
          </div>
          <div className="col-auto">
            {/* <div className="text-15 text-light-1">{amenity.count}</div> */}
          </div>
        </div>
      ))}
    </>
  );
};

export default AmenitiesFilter;
