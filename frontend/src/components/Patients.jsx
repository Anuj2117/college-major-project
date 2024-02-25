import React, { useContext, useState } from "react";
import { HisContext } from "../HisContext";
import UserCard from "./UserCard/UserCard";
export default function Patients({ setOption }) {
  const { users, fetchPatientByName, loadAlltheUsers } = useContext(HisContext);

  const [name, setName] = useState("");
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
          Total Patients: {users.length}
        </h4>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPatientByName(name);
          }}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="mb-3">
            <input
              onChange={(e) => setName(e.currentTarget.value)}
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Search Patient"
            />
          </div>
        </form>

        <button onClick={loadAlltheUsers} className="btn btn-sm btn-primary">
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
            />
          </div>
        ))}
      </div>
    </div>
  );
}
