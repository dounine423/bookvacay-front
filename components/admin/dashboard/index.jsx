import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ChartSelect from "./component/ChartSelect";
import ChartMain from "./component/ChartMain";
import DashboardCard from "./component/DashboardCard";
import { API } from '../../../pages/api/api'
import { adminDashBoardAction } from "../../../features/admin/adminDashboard";


const DashBoard = () => {

    const dispatch = useDispatch()
    const { paymentInfo } = useSelector(state => state.adminDashboard)

    const [group, setGroup] = useState(0)
    const [type, setType] = useState(0)
    const [date, setDate] = useState({
        year: moment().format('YYYY'),
        month: moment().format('MM'),
        day: moment().format('DD'),
    })
    const [chartData, setChartData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [request, setRequest] = useState(true)

    const getStatisticsData = async () => {
        setLoading(true)
        let params = {
            group: group + 1,
            date,
            type: type + 1
        }
        const { data } = await API.post('/getStatisticsByAdmin', params)
        if (data.success) {
            setChartData(data.result)
        } else {
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
        }
        setLoading(false)
        setRequest(false)
    }

    const getPaymentInfo = async () => {
        const { data } = await API.get('/getPaymentInfoByAdmin')
        if (data.success) {
            dispatch(adminDashBoardAction({ type: 'paymentInfo', data: data.result }))
        }
    }

    useEffect(() => {
        if (request)
            getPaymentInfo()
        if (request) {
            getStatisticsData()
        }
    }, [request])

    return (
        <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
                <div className="col-12">
                    <h1 className="text-30 lh-14 fw-600">Dashboard</h1>
                    <div className="text-15 text-light-1">
                        Lorem ipsum dolor sit amet, consectetur.
                    </div>
                </div>
            </div>
            <ToastContainer />
            {
                paymentInfo ? (
                    <DashboardCard amountInfo={paymentInfo} />
                ) : null
            }

            <div className={"row y-gap-30 pt-20 chart_responsive" + (loading ? " disable" : "")}>
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                    <h2 className="text-18 lh-1 fw-500">Earning Statistics</h2>
                    <div className="row justify-end">
                        <div className="col-md-6">
                            <ChartSelect
                                getDate={setDate}
                                type={type}
                                getType={setType}
                                group={group}
                                getGroup={setGroup}
                                getRequest={setRequest}
                            />
                        </div>
                    </div>
                    <div className="pt-30">
                        <ChartMain chartData={chartData} group={group} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default DashBoard