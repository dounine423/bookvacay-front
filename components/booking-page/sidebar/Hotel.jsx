import Image from "next/image";

const Hotel = ({ hotelData }) => {

    const { image, category, name, address, rate, reviewCnt, reviewWord } = hotelData

    return (
        <>
            <div className="row x-gap-15 y-gap-20">
                <div className="col-auto">
                    <Image
                        width={200}
                        height={200}
                        src={image}
                        alt="image"
                        className="size-200 rounded-4 object-cover"
                    />
                </div>
                {/* End .col */}
                <div className="col">
                    <div className="d-flex x-gap-5 pb-10">
                        {
                            Array(category).fill().map((_, i) => (
                                <i key={i} className="icon-star text-yellow-1 text-20" />
                            ))
                        }
                    </div>
                    {/* End ratings */}
                    <div className="lh-17 fw-500 text-18">
                        {name}
                    </div>
                    <div className="text-14 lh-15 mt-5 text-18">{address}</div>
                    <div className="row x-gap-10 y-gap-10 items-center pt-10">
                        <div className="col-auto">
                            <div className="d-flex items-center">
                                <div className="size-40 flex-center bg-blue-1 rounded-4">
                                    <div className="text-15 fw-600 text-white">{rate}</div>
                                </div>
                                <div className="text-18 fw-500 ml-10">{reviewWord}</div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="text-18">{reviewCnt} reviews</div>
                        </div>
                    </div>
                </div>
                {/* End .col */}
            </div>
        </>
    )
}

export default Hotel