import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { HisContext } from "../../../HisContext";
const localizer = momentLocalizer(moment);
import { useContext, useRef } from "react";
import { toast } from "react-toastify";

export default function ViewDoctorSlots({ slots, setSlots }) {
  const { user, BASE_URL } = useContext(HisContext);
  const bookSlot = (slotId) => {
    fetch(`${BASE_URL}/user/patients/book/${slotId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Slot Booked");
          setSlots((prev) => prev.filter((item) => item._id != slotId));
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  const closeRef = useRef(null);

  return (
    <div
      className="modal fade"
      id="exampleModal2"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Ashsih kumar
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <Calendar
              localizer={localizer}
              startAccessor="start"
              endAccessor="end"
              events={slots}
              style={{ height: 500 }}
              onSelectEvent={(event) => {
                let ok = confirm("Do you want to book this slot ?");
                if (ok) {
                  bookSlot(event._id);
                  closeRef.current.click();
                }
              }}
            />
          </div>

          <div className="modal-footer">
            <button
              ref={closeRef}
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
