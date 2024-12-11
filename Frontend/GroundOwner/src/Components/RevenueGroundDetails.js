import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RevenueGroundDetails() {
  const navigate = useNavigate();
  const [stadiumData, setStadiumData] = useState({});
  const [imagesData, setimagesData] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [pitchData, setPitchData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("authToken");
      const ground_id = sessionStorage.getItem("groundID");

      if (!token) {
        alert("No authentication token found. Redirecting to login.");
        window.location.href = "/authpageownerlogin";
        return;
      }

      if (!ground_id) {
        alert("No ground id is found");
        window.location.href = "/groundselection";
        return;
      }

      try {
        setLoading(true);

        const stadiumResponse = await axios.get(
          `http://127.0.0.1:8090/ground_detail/${ground_id}`
        );
        const pitchResponse = await axios.get(
          `http://127.0.0.1:8090/ground_detail/ground_detail/pitches/${ground_id}`
        );
        const revenueResponse = await axios.get(
          `http://127.0.0.1:8090/revenue/${ground_id}`
        );
        const imagesResponse = await axios.get(
          `http://127.0.0.1:8090/ground_detail/groundimages/${ground_id}`
        );

        setimagesData(imagesResponse.data);
        setStadiumData(stadiumResponse.data);
        setPitchData(pitchResponse.data);
        setRevenueData(revenueResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const changePage = () => {
    alert("admin portal under development")
  };

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center">
        {/* Owner Details */}
        <div className="owner-img-name-edit my-5">
          <div className="owner-name-edit">
            <h2 className="owner-name" style={{ color: "#0d705c" }}>
              Hi! {sessionStorage.getItem("email")}
            </h2>
          </div>
        </div>

        {/* Stadium Details */}
        <div className="d-flex flex-column align-items-center flex-wrap-wrap w-100" style={{ border: "2px solid #55ad9b", borderRadius: "30px" }}>
          <h2 className="py-3" style={{ color: "#55ad9b", fontSize: "45px" }}>
            Stadium Details
          </h2>
          <div className="px-3" style={{ width: "80%" }}>
            <div className="info-text-ground">
              <div className="name-rev">
                <div className="name-rating-ground">
                  <h3>{stadiumData.name}</h3>
                </div>
                <div className="rating-ground">
                  <span>{stadiumData.rating}/5⭐</span>
                </div>
              </div>
              {/* <div className="venue">
                <p>Stadium Type: {stadiumData.type}</p>
                <p>Sports Hours: {stadiumData.sportsHours}</p>
              </div> */}
              <div className="loc">
                <FaMapMarkerAlt className="icon" />
                <p>{stadiumData.address}</p>
                <br />
              </div>
            </div>
            <div className="pitch-pictures-edit">
              <div id="carouselExampleIndicators" className="carousel slide">
                <div className="carousel-indicators">
                  {imagesData.images?.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                      aria-current={index === 0 ? "true" : undefined}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
                <div className="carousel-inner">
                  {imagesData.images?.map((base64Image, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${
                        index === 0 ? "active" : ""
                      } image-slide`}
                    >
                      <img
                        src={`data:image/jpeg;base64,${base64Image}`}
                        className="d-block w-100"
                        alt={`Ground image ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div className="description py-4">
              <h3>Description</h3>
              <p>{stadiumData.description}</p>
            </div>
            <div className="pitch-data pb-3">
              {pitchData?.map((pitch, index) => (
                <div key={index} className="pitch-dimen-price">
                  <span style={{ color: "#55ad9b", fontWeight: 700 }}>
                    {`${pitch.name} (${pitch.length}/${pitch.width})`}
                  </span>
                  <span
                    style={{ fontWeight: 500 }}
                  >{`Rs.${pitch.price_per_60mins}/H`}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3">
            <button className="edit-ground" onClick={changePage}>
              Edit
            </button>
          </div>
        </div>

        {/* Revenue Details */}
        <div className="revenue my-5">
          <h2>Revenue Details</h2>
          <div className="revenue-data">
            <div
              style={{ borderBottom: "3px dashed #55ad9b" }}
              className="revenue-data-specific pt-1 pb-4"
            >
              <span>
                <b>No. of Bookings Last Month:</b>{" "}
                {revenueData.lastMonthBookings}
              </span>
              <span>
                <b>Revenue Last Month:</b> Rs.{revenueData.lastMonthRevenue}
              </span>
            </div>
            <div
              style={{ borderBottom: "3px dashed #55ad9b" }}
              className="revenue-data-specific pt-1 pb-4"
            >
              <span>
                <b>No. of Bookings this Month:</b>{" "}
                {revenueData.currentMonthBookings}
              </span>
              <span>
                <b>Revenue this Month:</b> Rs.{revenueData.currentMonthRevenue}
              </span>
            </div>
            <div className="revenue-data-specific pt-1 pb-1">
              <span>
                <b>Total No. of Bookings:</b> {revenueData.totalBookings}
              </span>
              <span>
                <b>Total Revenue:</b> Rs.{revenueData.totalRevenue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
