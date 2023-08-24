import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

const FacilityFilter = ({ getFacility }) => {

    const { facilities } = useSelector(state => state.region)
    const [checkList, setCheckList] = useState([])

    const onCheckBoxHandler = (groupId, itemId) => {
        let temp = JSON.parse(JSON.stringify(checkList))
        temp[groupId].data[itemId].checked = !temp[groupId].data[itemId].checked
        getFacility(temp)
        setCheckList([...temp])
    }

    useEffect(() => {
        if (facilities)
            setCheckList([...facilities])
    }, [facilities])

    return (
        <>{
            checkList.map((group, groupId) => (
                <div className="row y-gap-10 items-center justify-between" key={groupId}>
                    <h5 className="text-20 fw-500 mb-10">{group.name}</h5>
                    {
                        group.data.map((item, itemId) => (
                            <div key={itemId}>
                                <div className="form-checkbox d-flex items-center">
                                    <input type="checkbox" checked={item.checked} onChange={() => onCheckBoxHandler(groupId, itemId)} />
                                    <div className="form-checkbox__mark">
                                        <div className="form-checkbox__icon icon-check" />
                                    </div>
                                    <div className="text-15 ml-10">{item.name}</div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            ))
        }
        </>
    )
}

export default FacilityFilter