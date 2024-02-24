import React, { useContext, useRef, useState, useEffect } from "react";
import { HisContext } from "../../HisContext";

import "./chat.css";
import LeftCard from "./LeftCard";

export default function Chat() {
  const { users, sendMessage, messages, user, receiver } =
    useContext(HisContext);

  const [message, setMessage] = useState("");

  const lastRef = useRef(null);

  useEffect(() => {
    lastRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container-fluid" style={{ margin: 0, padding: 0 }}>
      <div className="inbox_people">
        <div className="headind_srch">
          <div className="recent_heading">
            <h4>Chats</h4>
          </div>
        </div>
        <div className="inbox_chat">
          {users.map((item, index) => (
            <LeftCard
              key={index}
              name={item.name}
              imgUrl={item.imgUrl}
              _id={item._id}
            />
          ))}
        </div>
      </div>
      <div className="mesgs">
        <div className="msg_history">
          {messages.length == 0 && (
            <p style={{ textAlign: "center" }}>No Messages Found</p>
          )}
          {messages.map((item, index) => {
            if (user._id == item.sender) {
              return (
                <div className="outgoing_msg">
                  <div className="sent_msg">
                    <p>{item && item.content}</p>
                    <span className="time_date">
                      {" "}
                      {new Date(item && item.createdAt).toLocaleString()}
                    </span>{" "}
                  </div>
                </div>
              );
            } else {
              return (
                <div className="incoming_msg">
                  <div className="incoming_msg_img">
                    {" "}
                    <img
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                      src={receiver && receiver.imgUrl}
                      alt="sunil"
                    />{" "}
                  </div>
                  <div className="received_msg">
                    <div className="received_withd_msg">
                      <p>{item && item.content}</p>
                      <span className="time_date">
                        {" "}
                        {new Date(item && item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          })}

          <div ref={lastRef}></div>
        </div>
        <div className="type_msg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(message);
              setMessage("");
            }}
          >
            <div className="input_msg_write">
              <input
                onChange={(e) => setMessage(e.currentTarget.value)}
                value={message}
                type="text"
                className="write_msg"
                placeholder="Type a message"
              />
              <button className="msg_send_btn" type="button">
                &#8618;
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
