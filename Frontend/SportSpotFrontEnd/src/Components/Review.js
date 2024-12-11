import React, { useState } from "react";

let groundData = null;
try {
  groundData = sessionStorage.getItem("ground_data");
} catch (error) {
  console.error("Failed to parse ground_data from sessionStorage:", error);
}

const email = sessionStorage.getItem("email");

function Review({ addReview }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Done!", comment, rating)
    if (!groundData) {
      alert("Ground data is missing or invalid. Please refresh the page.");
      return;
    }

    const newReview = {
      user_id: email,
      comment,
      rating,
      ground: groundData,
    };
    addReview(newReview);
    setComment("");
    setRating(0);
  };

  if (!groundData) {
    return <p>Error: Ground information is not available. Please try again later.</p>;
  }

  return (
    <form className="review-work" onSubmit={handleSubmit}>
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < rating ? "selected" : ""}`}
            onClick={() => handleStarClick(index)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        className="review-text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here"
        required
      ></textarea>
      <button className="review-btn" type="submit">
        Submit Review
      </button>
    </form>
  );
}

export default Review;


