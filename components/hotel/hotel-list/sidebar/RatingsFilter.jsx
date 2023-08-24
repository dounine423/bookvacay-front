import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const RatingsFilter = ({ getCurValue }) => {
  const { filter } = useSelector(state => state.hotel)
  const ratings = [1, 2, 3, 4, 5];
  const [activeRating, setActiveRating] = useState(null);

  const handleRatingClick = (rating) => {
    setActiveRating(rating === activeRating ? null : rating);
    getCurValue(rating === activeRating ? null : rating);
  };

  useEffect(() => {
    if (filter.category != activeRating) {
      setActiveRating(filter.category)
    }
  }, [filter?.category])
  return (
    <>
      <div className="d-flex justify-between">
        {ratings.map((rating) => (
          <div key={rating}>
            <button
              className={`button -blue-1 bg-blue-1-05 text-blue-1 py-5 px-20 rounded-100 ${rating === activeRating ? "active" : ""
                }`}
              onClick={() => handleRatingClick(rating)}
            >
              {rating}
            </button>
          </div>
        ))}
      </div>

    </>
  );
};

export default RatingsFilter;
