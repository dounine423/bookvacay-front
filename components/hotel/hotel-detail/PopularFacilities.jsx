
const PopularFacilities = ({ facilityList }) => {

  return (
    <>
      <div className="facilityGroup">
        {
          facilityList?.map((facilityGroup, groupId) => (
            <div className=" mt-5" key={groupId}>
              <h6 className="mb-15 mt-10 text-18 fw-400">{facilityGroup?.name}</h6>
              <div className="facilityBody">
                {
                  facilityGroup?.data?.map((facility, facilityId) => (
                    <div className="mb-10" key={facilityId} >
                      <i className="icon-check text-10 mr-5 text-15" style={{ color: "#034B03" }} />
                      <span className={facility.indFee ? "fw-500" : "" + " ml-4 text-15"} style={{ color: "#034B03" }}>{facility.name} {facility.indFee ? " *" : ""} {facility.amount ? (facility.currency + " " + facility.amount) : null}</span>
                      {/* <span className="ml-4 text-15" style={{ color: "#034B03" }}>{facility?.name} {facility?.distance ? facility?.distance + "(m)" : null}</span> */}
                    </div>
                  ))
                }
              </div>

            </div>
          ))
        }
      </div>
    </>
  );
};

export default PopularFacilities;
