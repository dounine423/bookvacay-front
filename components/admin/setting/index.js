import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingDetail from '../../profile/person-detail/';

const Setting = () => {

    const [loading, setLoading] = useState(false)

    return (
        <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
                <div className="col-12">
                    <h1 className="text-30 lh-14 fw-600">Admin Setting</h1>
                </div>
            </div>
            <ToastContainer />
            <SettingDetail />
            <div className={"row y-gap-30 pt-20 chart_responsive" + (loading ? " disable" : "")}>

            </div>
        </div >
    )
}

export default Setting