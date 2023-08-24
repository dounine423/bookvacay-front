import { useEffect } from 'react';

const ImportantInfo = ({ content }) => {

  const { featureGroups, importantInfo, routes, highligths, location } = content

  return (
    <div style={{ columnCount: 3, columnGap: '40px' }} className=" x-gap-40 y-gap-40 justify-between pt-20">
      <p className="fw-500 text-black text-20">Features</p>
      {
        featureGroups?.map((group, gId) => (
          <ul key={gId}>
            <p className="fw-500 ml-10 text-black text-18">{group.groupCode}</p>
            {
              group?.included?.map((include, includeId) => (
                <li key={gId + "include" + includeId}>
                  <i className="icon-check text-green-2 text-16 mr-10"></i>
                  <span>{include?.description}</span>
                </li>
              ))
            }
            {
              group?.excluded?.map((exclude, excludeId) => (
                <li key={gId + "exclude" + excludeId}>
                  <i className="icon-close text-red-1 text-16 mr-10"></i>
                  <span>{exclude?.description}</span>
                </li>
              ))
            }
          </ul>
        ))
      }
      {
        importantInfo?.length > 0 ? (
          <ul>
            <p className="fw-500  text-black text-20">Important Information</p>
            {
              importantInfo?.map((item, id) => (
                <li key={id}>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))
            }
          </ul>
        ) : null
      }
      {
        highligths?.length > 0 ? (
          <ul>
            <p className="fw-500  text-black text-20">HighLight</p>
            {
              highligths?.map((item, id) => (
                <li key={id}>
                  {item}
                </li>
              ))
            }
          </ul>
        ) : null
      }
      {
        routes?.length > 0 ? (
          <ul>
            <p className="fw-500  text-black text-20">Routes</p>
            {
              routes?.map((item, id) => (
                <li key={id} className='mb-10'>
                  <div className='text-16 fw-300'>
                    <span className='mr-10'>{item?.description}</span>
                    <span>{item?.duration?.value} {item?.duration?.metric}</span>
                  </div>
                  <div className='d-flex mt-10'>
                    {item?.points?.map((point, pId) => (
                      <div key={pId} data-toggle="tooltip" data-placement="bottom" title={point?.pointOfInterest?.description} className={'bg-blue-1 text-white px-10  mr-20 radius-50' + (point?.pointOfInterest ? " cursor-pointer" : "")} >{point?.order}</div>
                    ))}
                  </div>
                </li>
              ))
            }
          </ul>
        ) : null
      }

    </div >
  );
};

export default ImportantInfo;
