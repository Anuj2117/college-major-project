import React, { useContext, useState } from "react";
import UpdateProfile from "./UpdateProfile/UpdateProfile";
import Patients from "./Patients";
import Chat from "./chats/Chat";
import { HisContext } from "../HisContext";
import DoctorAppointment from "./appointements/doctors/DoctorAppointment";
export default function DoctorDashboard() {
  // appointement patient chat profile
  const [option, setOption] = useState("appointement");
  const { logout, user } = useContext(HisContext);

  console.log(option);
  return (
    <div>
      <div className="row">
        <div
          className="col-4 d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
          style={{ width: 280, height: "92vh", margin: 0, padding: 0 }}
        >
          <a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span className="fs-4">Doctor Dashboard</span>
          </a>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li onClick={() => setOption("appointement")}>
              <a
                className={
                  option == "appointement"
                    ? "nav-link text-white active"
                    : "nav-link text-white"
                }
                aria-current="page"
              >
                Appointments
              </a>
            </li>
            <li onClick={() => setOption("patient")}>
              <a
                className={
                  option == "patient"
                    ? "nav-link text-white active"
                    : "nav-link text-white"
                }
              >
                Patients
              </a>
            </li>
            <li onClick={() => setOption("chat")}>
              <a
                className={
                  option == "chat"
                    ? "nav-link text-white active"
                    : "nav-link text-white"
                }
              >
                Chats
              </a>
            </li>
            <li onClick={() => setOption("profile")}>
              <a
                className={
                  option == "profile"
                    ? "nav-link text-white active"
                    : "nav-link text-white"
                }
                href="#"
              >
                Profile
              </a>
            </li>
          </ul>
          <hr />
          <div className="dropdown">
            <a
              href="#"
              className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={user && user.imgUrl}
                alt=""
                width={32}
                height={32}
                className="rounded-circle me-2"
              />
              <strong>{user && user.name}</strong>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-dark text-small shadow"
              aria-labelledby="dropdownUser1"
            >
              <li>
                <a onClick={logout} className="dropdown-item" href="#">
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="col" style={{ margin: 0, padding: 0 }}>
          {option == "chat" && <Chat />}
          {option == "appointement" && (
            <DoctorAppointment setOption={setOption} />
          )}
          {option == "patient" && <Patients setOption={setOption} />}
          {option == "profile" && <UpdateProfile />}
        </div>
      </div>
    </div>
  );
}
