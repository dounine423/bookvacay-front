import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomerInfo from "../CustomerInfo";
import PaymentInfo from "../PaymentInfo";
import HotelBook from "../HotelBook";
import ActivityBook from "../ActivityBook";

const Index = () => {

  const { hotelReserve } = useSelector(state => state.hotel)
  const { activityReserve } = useSelector(state => state.activity)
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    if (steps.length > 0) {
      const { content } = steps[currentStep];
      return <div key={currentStep}>{content}</div>;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  let steps = []
  steps.push(
    {
      title: "Personal Details",
      stepBar: (
        <>
          <div className="col d-none d-sm-block">
            <div className="w-full h-1 bg-border"></div>
          </div>
        </>
      ),
      content: <CustomerInfo nextFunction={nextStep} />,
    }
  )
  if (hotelReserve != null)
    steps.push(
      {
        title: "Hotel",
        stepBar: (
          <>
            <div className="col d-none d-sm-block">
              <div className="w-full h-1 bg-border"></div>
            </div>
          </>
        ),
        content: <HotelBook prevFunction={previousStep} nextFunction={nextStep} />,
      }
    )
  if (activityReserve.length > 0)
    steps.push(
      {
        title: "Activity",
        stepBar: (
          <>
            <div className="col d-none d-sm-block">
              <div className="w-full h-1 bg-border"></div>
            </div>
          </>
        ),
        content: <ActivityBook nextFunction={nextStep} />,
      }
    )
  steps.push({
    title: "Payment Details",
    stepNo: "2",
    stepBar: (
      <>
        <div className="col d-none d-sm-block">
          <div className="w-full h-1 bg-border"></div>
        </div>
      </>
    ),
    content: <PaymentInfo prevFunction={previousStep} nextFunction={nextStep} />,
  })
  steps.push({
    title: "Final Step",
    stepNo: "4",
    stepBar: ""
  })
  return (
    <>
      <div className="row x-gap-40 y-gap-30 items-center">
        {
          steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="col-auto">
                <div
                  className="d-flex items-center transition"
                >
                  <div
                    className={
                      currentStep === index
                        ? "active size-40 rounded-full flex-center bg-blue-1"
                        : "size-40 rounded-full flex-center bg-blue-1-05 text-blue-1 fw-500"
                    }
                  >
                    {currentStep === index ? (
                      <>
                        <i className="icon-check text-16 text-white"></i>
                      </>
                    ) : (
                      <>
                        <span>{index + 1}</span>
                      </>
                    )}
                  </div>
                  <div className="text-18 fw-500 ml-10"> {step.title}</div>
                </div>
              </div>
              {/* End .col */}
              {step.stepBar}
            </React.Fragment>
          ))
        }

      </div>
      {/* End stepper header part */}
      <div className="row" key={currentStep}>{renderStep()}</div>

      {/* <div className="row x-gap-20 y-gap-20 pt-20">
        <div className="col-auto">
          <button
            className="button h-60 px-24 -blue-1 bg-light-2"
            disabled={currentStep === 0}
            onClick={previousStep}
          >
            Previous
          </button>
        </div>
        <div className="col-auto">
          <button
            className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
            disabled={currentStep === steps.length - 1}
            onClick={previousStep}
          >
            Next <div className="icon-arrow-top-right ml-15" />
          </button>
        </div>
      </div> */}
    </>
  );
};

export default Index;
