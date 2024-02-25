import React, { useContext } from "react";
import { HisContext } from "../../HisContext";

export default function LeftCard({ name, imgUrl, _id }) {
  const { setReceiver, receiver } = useContext(HisContext);

  return (
    <div
      className={
        receiver && receiver._id == _id ? "chat_list active_chat" : "chat_list"
      }
      id="user-card-t"
      onClick={() => setReceiver({ name, imgUrl, _id })}
    >
      <div className="chat_people">
        <div className="chat_img">
          {" "}
          <img
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            src={imgUrl}
            alt="sunil"
          />{" "}
        </div>
        <div className="chat_ib">
          <h5 style={{ marginTop: 5 }}>{name}</h5>
        </div>
      </div>
    </div>
  );
}
