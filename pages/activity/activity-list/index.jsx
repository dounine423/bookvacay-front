import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router, { withRouter } from "next/router";
import { PaginationControl } from 'react-bootstrap-pagination-control';
import Footer5 from "../../../components/footer/footer-5";
import Seo from "../../../components/common/Seo";
import Header11 from "../../../components/header/header-11";
import MainFilterSearchBox from "../../../components/activity/common/MainFilterSearchBox";
import TopHeaderFilter from "../../../components/activity/activity-list/TopHeaderFilter";
import ActivityProperties from "../../../components/activity/activity-list/ActivityProperties";
import { activityOperation } from "../../../features/activity/activity";
import { API } from '../../api/api'
import { regionAction } from "../../../features/region/region";

const index = () => {
  const dispatch = useDispatch()
  const { currency } = useSelector(state => state.region)
  const { LoggedIn } = useSelector(state => state.auth)
  const { availability, total_avail, pagination, request, index } = useSelector(state => state.activity)
  const pageSize = 12

  const [curPage, setCurrentPage] = useState(pagination);
  const [loading, setLoading] = useState(false);
  const [curRequest, setRequest] = useState(request)

  const getActivities = async () => {
    const { checkIn, checkOut, paxes, type, code } = availability
    let params = {
      type,
      code,
      paxes,
      from: checkIn,
      to: checkOut,
      page: pagination,
      limit: pageSize,
      currency
    }
    setLoading(true)
    const { data } = await API.post('/getAvailActivities', params)
    if (data.success) {
      dispatch(regionAction({ type: 'currencyInfo', data: data.result.currencyInfo }))
      dispatch(activityOperation({ type: 'total_avail', data: data.result }))
    }
    else {
      dispatch(activityOperation({ type: 'total_avail', data: { total: 0, activities: [] } }))
    }
    setLoading(false)
    setRequest(false)
  }

  const onHandlePagination = (page) => {
    setCurrentPage(page);
    dispatch(activityOperation({ type: 'pagination', data: page }))
    setRequest(true)
  }

  const getActivityDetail = async (code) => {
    const { checkIn, checkOut, paxes } = availability
    setLoading(true)
    let params = {
      code,
      from: checkIn,
      to: checkOut,
      paxes,
      currency
    }
    const { data } = await API.post('/getActivityDetail', params)
    if (data.success) {
      dispatch(activityOperation({ type: 'curActivity', data: data.result }))
      Router.push({ pathname: '/activity/activity-detail/' })
    } else {
      toast.error("Something went wrong", {
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
  }

  const saveResult = () => {
    dispatch(activityOperation({ type: 'request', data: false }))
  }

  const onCurrencyChangeHandler = () => {
    setRequest(true)
  }

  useEffect(() => {
    if (LoggedIn) {
      if (curRequest == true) {
        getActivities()
      }
    } else {
      Router.push({ pathname: '/login' })
    }

    return () => { saveResult() }
  }, [curRequest])

  return (
    <>
      <Seo pageTitle={"Activities in " + index?.name} />
      <div className="header-margin"></div>
      <Header11 currencyHandler={onCurrencyChangeHandler} />
      <section className="pt-40 pb-40 bg-light-2">
        <div className="container">
          <div className="row">
            <div className={"col-12" + (loading ? " disable" : null)} >
              <div className="text-center">
                <h1 className="text-30 fw-600">Activities in {(index?.name)}</h1>
              </div>
              <MainFilterSearchBox
                getRequest={setRequest}
                setPagination={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </section >
      <ToastContainer />
      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30 position-relative">
            <div className="position-absolute" style={{ top: '50px', left: '50%' }} >
              <ClipLoader loading={loading} size={100} />
            </div>
            {
              total_avail ? (
                <div className={"col-xl-12" + (loading ? " disable" : null)} >
                  <TopHeaderFilter total={total_avail?.total} location={index?.name} />
                  <div className="mt-30" />
                  <div className="row y-gap-30 mb-30">
                    {
                      total_avail?.activities?.map((item, id) => (
                        <ActivityProperties
                          key={id}
                          activity={item}
                          getDetail={getActivityDetail}
                        />
                      ))
                    }
                  </div>
                  <PaginationControl
                    page={curPage}
                    between={3}
                    total={total_avail.total}
                    limit={pageSize}
                    changePage={(page) => onHandlePagination(page)}
                    ellipsis={1}
                  />
                </div>
              ) : null
            }
          </div>
        </div>
      </section >
      <Footer5 />
    </>
  );
};

export default withRouter(index);
