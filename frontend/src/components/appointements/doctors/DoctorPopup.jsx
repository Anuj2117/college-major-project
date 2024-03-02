import { useRef, useContext } from "react";
import { HisContext } from "../../../HisContext";

export default function DoctorPopup({ slot, deleteSlot, setOption }) {
  const closeRef = useRef(null);
  const { setReceiver } = useContext(HisContext);
  const takeTomessageScreen = () => {
    // 1. I will close popup
    closeRef.current.click();
    // 2. i will change the reciever
    setReceiver({
      name: slot.bookedBy.name,
      imgUrl: slot.bookedBy.imgUrl,
      _id: slot.bookedBy._id,
    });
    // 2. i will move to chat screent
    setOption("chat");
  };

  return (
    <div
      className="modal fade"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      id="exampleModal"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Slot Details
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <p>
                <b>Start Time</b>
              </p>
              <p>
                <b>End Time</b>
              </p>
            </div>
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <p>{slot && slot.start.toLocaleString()}</p>
              <p>{slot && slot.end.toLocaleString()}</p>
            </div>
            {slot && slot.isBooked && <h3>Patient Details</h3>}

            {slot && slot.isBooked && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <img
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                  src={slot?.bookedBy?.imgUrl}
                />
                <div>
                  <p>Name: {slot?.bookedBy?.name}</p>
                  <p>Email: {slot?.bookedBy?.email}</p>
                  <button
                    onClick={takeTomessageScreen}
                    class="btn btn-primary btn-sm"
                  >
                    Message
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              ref={closeRef}
            >
              Close
            </button>
            {slot && slot.isBooked ? null : (
              <button
                onClick={() => {
                  deleteSlot(slot._id);
                  closeRef.current.click();
                }}
                type="button"
                className="btn btn-danger"
              >
                Delete Slot
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
