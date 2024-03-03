import React, { useContext, useEffect } from "react";
import { HisContext } from "../HisContext";
import UserCard from "./UserCard/UserCard";
import { useState, useRef } from "react";
import ViewDoctorSlots from "./appointements/patients/ViewDoctorSlots";

export default function Doctors({ setOption }) {
  const {
    users,
    loadAlltheUsers,
    departments,
    fetchDoctorByName,
    fetchDoctorsByDepartment,
    BASE_URL,
    user,
  } = useContext(HisContext);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("none");
  const [clickedDocorId, setClickedDoctorId] = useState("");

  const [slots, setSlots] = useState([]);
  const popupRef = useRef(null);

  const getAllOpenSlotsOfDoctor = () => {
    fetch(`${BASE_URL}/user/patients/get-doctor-open-slots/${clickedDocorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          let temp = [];
          data.slots.forEach((item, index) => {
            temp.push({
              start: new Date(item.start),
              end: new Date(item.end),
              _id: item._id,
              title: "Available",
            });
          });

          setSlots(temp);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    if (clickedDocorId) {
      getAllOpenSlotsOfDoctor();
    }
  }, [clickedDocorId]);

  return (
    <div className="mt-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          padding: 10,
        }}
      >
        <h4 style={{ fontFamily: "sans-serif" }} className="text-muted">
          Total Doctors: {users.length}
        </h4>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchDoctorByName(name);
          }}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="mb-3">
            <input
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Search Patient"
            />
          </div>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (department != "none") fetchDoctorsByDepartment(department);
          }}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="mb-3">
            <select
              value={department}
              onChange={(e) => setDepartment(e.currentTarget.value)}
            >
              <option value="none">Select Department</option>
              {departments.map((item, index) => (
                <option value={item._id} key={index}>
                  {item.name}
                </option>
              ))}
            </select>
            <input class="btn btn-sm btn-primary mx-2" type="submit" />
          </div>
        </form>

        <button
          onClick={() => {
            loadAlltheUsers();
            setName("");
            setDepartment("none");
          }}
          className="btn btn-sm btn-primary"
        >
          Reset
        </button>
      </div>
      <hr />
      <div className="row">
        {users.map((item, index) => (
          <div key={index} className="col col-6">
            <UserCard
              name={item.name}
              imgUrl={item.imgUrl}
              email={item.email}
              address={item.address}
              phoneNumber={item.phoneNumber}
              gender={item.gender}
              _id={item._id}
              setOption={setOption}
              about={item.about}
              departmentName={item?.departmentId?.name}
              popupRef={popupRef}
              setClickedDoctorId={setClickedDoctorId}
            />
          </div>
        ))}
      </div>

      <button
        ref={popupRef}
        style={{ display: "none" }}
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal2"
      >
        Launch demo modal
      </button>
      {/* Modal */}

      <ViewDoctorSlots setSlots={setSlots} slots={slots} />
    </div>
  );
}
