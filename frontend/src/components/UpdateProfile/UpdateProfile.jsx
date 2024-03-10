import React, { useContext, useState, useRef } from "react";
import { toast } from "react-toastify";
import { HisContext } from "../../HisContext";
import "./updateProfile.css";
export default function UpdateProfile() {
  const { user, uploadProfilePic, updateProfile, changePassword } =
    useContext(HisContext);

  const [name, setName] = useState(user ? user.name : "");
  const [phone, setPhone] = useState(user ? user.phoneNumber : "");
  const [about, setAbout] = useState(user ? user.about : "");
  const [street, setStreet] = useState(
    user && user.address ? user.address.street : ""
  );
  const [city, setCity] = useState(
    user && user.address ? user.address.city : ""
  );
  const [state, setState] = useState(
    user && user.address ? user.address.state : ""
  );
  const [zip, setZip] = useState(user && user.address ? user.address.zip : "");

  const imageRef = useRef(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  return (
    <div className="container">
      <div className="row mt-5 gutters">
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="account-settings">
                <div className="user-profile">
                  <div
                    onClick={() => imageRef.current.click()}
                    className="user-avatar"
                  >
                    <img src={user && user.imgUrl} alt="Maxwell Admin" />
                  </div>
                  <input
                    onChange={(e) => uploadProfilePic(e.currentTarget.files[0])}
                    style={{ display: "none" }}
                    ref={imageRef}
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                  <h5 className="user-name">{user && user.name}</h5>
                  <h6 className="user-email">{user && user.email}</h6>
                </div>
                <div className="about">
                  <h5>About</h5>
                  <p>{user && user.about}</p>
                </div>
                <div className="about">
                  <h5>Change Password</h5>
                  <div className="form-group my-2">
                    <input
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.currentTarget.value)}
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder="Old Password"
                    />
                  </div>
                  <div className="form-group my-2">
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.currentTarget.value)}
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder="New Password"
                    />
                    <div className="form-group my-2">
                      <input
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.currentTarget.value)}
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Confirm New Password"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (newPassword != newPassword2) {
                          toast.error("Password are not matching");
                        } else {
                          changePassword(oldPassword, newPassword);
                        }
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h6 className="mb-2 text-primary">Personal Details</h6>
                </div>
                <div className="col-xl-6 my-3 mcol-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.currentTarget.value)}
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
                <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="eMail">Email</label>
                    <input
                      value={user && user.email}
                      disabled
                      type="email"
                      className="form-control"
                      id="eMail"
                      placeholder="Enter email ID"
                    />
                  </div>
                </div>
                <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.currentTarget.value)}
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="website">About</label>
                    <input
                      value={about}
                      onChange={(e) => setAbout(e.currentTarget.value)}
                      type="url"
                      className="form-control"
                      id="website"
                      placeholder="About You"
                    />
                  </div>
                </div>
              </div>
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h6 className="mt-3 mb-2 text-primary">Address</h6>
                </div>
                <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="Street">Street</label>
                    <input
                      value={street}
                      onChange={(e) => setStreet(e.currentTarget.value)}
                      type="name"
                      className="form-control"
                      id="Street"
                      placeholder="Enter Street"
                    />
                  </div>
                </div>
                <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="ciTy">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.currentTarget.value)}
                      type="name"
                      className="form-control"
                      id="ciTy"
                      placeholder="Enter City"
                    />
                  </div>
                </div>
                <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="sTate">State</label>
                    <input
                      value={state}
                      onChange={(e) => setState(e.currentTarget.value)}
                      type="text"
                      className="form-control"
                      id="sTate"
                      placeholder="Enter State"
                    />
                  </div>
                </div>
                <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="zIp">Zip Code</label>
                    <input
                      value={zip}
                      onChange={(e) => setZip(e.currentTarget.value)}
                      type="text"
                      className="form-control"
                      id="zIp"
                      placeholder="Zip Code"
                    />
                  </div>
                </div>
              </div>
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="text-right">
                    <button
                      onClick={() =>
                        updateProfile(name, phone, about, {
                          city,
                          zip,
                          state,
                          street,
                        })
                      }
                      type="button"
                      id="submit"
                      name="submit"
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
