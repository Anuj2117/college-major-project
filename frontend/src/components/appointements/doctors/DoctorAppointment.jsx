import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);
import { useContext, useEffect, useState, useRef } from "react";
import { HisContext } from "../../../HisContext";
import { toast } from "react-toastify";
import DoctorPopup from "./DoctorPopup";
export default function DoctorAppointment({ setOption }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const { BASE_URL, user } = useContext(HisContext);
  const [slots, setSlots] = useState([]);

  const [clickedSlot, setClickedSlot] = useState(null);

  const openSlot = () => {
    fetch(`${BASE_URL}/user/doctors/slots/open`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
      body: JSON.stringify({ start, end }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Slot Opened");
          setSlots((prev) => [
            ...prev,
            {
              start: new Date(data.newSlot.start),
              end: new Date(data.newSlot.end),
              _id: data.newSlot._id,
              isBooked: data.newSlot.isBooked,
              title: data.newSlot.isBooked == true ? "Bookend" : "Available",
            },
          ]);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const deleteSlot = (slotId) => {
    fetch(`${BASE_URL}/user/doctors/slots/delete/${slotId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Slot Deleted");
          setSlots((prev) => prev.filter((item) => item._id != slotId));
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const fetchAllSlots = () => {
    fetch(`${BASE_URL}/user/doctors/slots/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // First we have to conver the start and end feidls from strign to date object
          let temp = [];
          data.slots.forEach((item, index) => {
            temp.push({
              start: new Date(item.start),
              end: new Date(item.end),
              _id: item._id,
              isBooked: item.isBooked,
              title: item.isBooked == true ? item.bookedBy.name : "Available",
              bookedBy: item.bookedBy ? item.bookedBy : null,
            });
          });

          setSlots(temp);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    fetchAllSlots();
  }, [user]);

  const buttonRef = useRef(null);

  return (
    <div style={{ padding: 10 }}>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={slots}
        style={{ height: 500 }}
        eventPropGetter={(event) => {
          const backgroundColor = event.isBooked ? "red" : "green";
          return { style: { backgroundColor } };
        }}
        onSelectEvent={(event) => {
          // 1. Store teh clicked event
          setClickedSlot(event);
          // 2. open popup
          buttonRef.current.click();
        }}
      />

      <div className="container row mt-3">
        <div
          style={{ border: "1px solid black", padding: 10 }}
          className="col col-3"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              openSlot();
            }}
          >
            <div className="form-group mt-2">
              <label>From</label>
              <input
                required
                type="datetime-local"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                onChange={(e) => setStart(e.currentTarget.value)}
              />
            </div>
            <div className="form-group mt-2">
              <label>To</label>
              <input
                required
                type="datetime-local"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                onChange={(e) => setEnd(e.currentTarget.value)}
                disabled={!start}
                min={start}
              />
            </div>

            <button type="submit" className="btn mt-2 btn-sm btn-primary">
              Open Slot
            </button>
          </form>
        </div>
        <div></div>
      </div>

      <>
        {/* Button trigger modal */}
        <button
          ref={buttonRef}
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style={{ display: "none" }}
        >
          Launch demo modal
        </button>

        <DoctorPopup
          setOption={setOption}
          slot={clickedSlot}
          deleteSlot={deleteSlot}
        />
      </>
    </div>
  );
}
