import React, { useContext } from "react";
import { HisContext } from "../../HisContext";
import "./usercard.css";
export default function UserCard({
  name,
  imgUrl,
  email,
  address,
  phoneNumber,
  gender,
  _id,
  setOption,
  about,
  departmentName,
  popupRef,
  setClickedDoctorId,
}) {
  const { setReceiver } = useContext(HisContext);
  return (
    <div className="container user-card profile-page mt-2">
      <div class="card profile-header">
        <div className="body">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-12">
              <div className="profile-image float-md-right">
                {" "}
                <img
                  style={{ width: "90px", height: "90px", borderRadius: "50%" }}
                  src={imgUrl}
                  alt=""
                />{" "}
              </div>
            </div>
            <div className="col-lg-8 col-md-8 col-12">
              <h4 className="m-t-0 m-b-0">
                <strong>{name}</strong>
              </h4>
              <span className="job_post">{email}</span>
              <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="job_post">
                  <b>Phone</b>: {phoneNumber}
                </span>
                <span className="job_post">
                  {" "}
                  <b>Gender</b>: {gender}
                </span>
              </div>
              <p>
                {address?.street} , {address?.city}, {address?.state}{" "}
              </p>

              {about && <p>About : {about}</p>}
              {departmentName && <p>Department : {departmentName}</p>}

              <div>
                <button
                  onClick={() => {
                    setReceiver({ name, imgUrl, _id });
                    setOption("chat");
                  }}
                  className="btn btn-primary btn-round btn-simple"
                >
                  Message
                </button>
                {departmentName && (
                  <button
                    onClick={() => {
                      setClickedDoctorId(_id);
                      popupRef.current.click();
                    }}
                    className="mx-2 btn btn-primary btn-round btn-simple"
                  >
                    Book Slot
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
