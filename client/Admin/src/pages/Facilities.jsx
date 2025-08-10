import React, { useState } from "react";
import "./Facilities.css";

export default function Facilities() {
  const [facilityName, setFacilityName] = useState("");
  const [rate, setRate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ facilityName, rate, capacity, status, image });
    alert("Facility added!");
  };

  return (
    <div className="facilities-container">
      <div className="back-btn">←</div>
      <h1 className="title">DORMITORIES</h1>

      <form className="facility-form" onSubmit={handleSubmit}>
        <label className="image-upload-box">
          {image ? (
            <img src={image} alt="Facility Preview" />
          ) : (
            <>
              <span className="upload-icon">⬆</span>
              <p>Upload Facility Image</p>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </label>

        <div className="form-row">
          <div className="form-group">
            <label>Facility Name:</label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Rate per Person:</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Capacity:</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <button type="submit" className="add-btn">
          ADD FACILITY
        </button>
      </form>
    </div>
  );
}
