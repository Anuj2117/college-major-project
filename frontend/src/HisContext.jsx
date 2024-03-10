import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { socket } from "./socket";

export const HisContext = createContext(null);

export default function HisProvider({ children }) {
  const BASE_URL = "http://localhost:3001";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = (email, password) => {
    setLoading(true);
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          // 1. Store the data in the user state
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          // 2. Navigate to the routes according to role
          const role = data.user.role;
          if (role == "DOCTOR") {
            navigate("/doctor/dashboard");
          } else if (role == "PATIENT") {
            navigate("/patient/dashboard");
          } else if (role == "ADMIN") {
            navigate("/admin/dashboard");
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  };

  const changePassword = (oldPassword, newPassword) => {
    fetch(`${BASE_URL}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Password Changed");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const signup = (email, password, phoneNumber, gender, name) => {
    fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name, phoneNumber, gender }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(
            "Please activate your account by the link shared on your email !"
          );
          navigate("/");
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  // address = {
  //   street:"",
  //   city:""
  //   zip::""
  // }
  const updateProfile = (name, phone, about, address) => {
    fetch(`${BASE_URL}/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
      body: JSON.stringify({ name, phone, about, address }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Profile Details Updated");
          // update the user state
          setUser({ ...user, name, phoneNumber: phone, about, address });
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  const uploadProfilePic = (file) => {
    // generate form data
    const media = new FormData();
    media.append("profile", file);

    fetch(`${BASE_URL}/user/profile-photo`, {
      method: "PUT",
      headers: {
        Authorization: user && user.accessToken,
      },
      body: media,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // if it's success update the user feiled
          setUser({ ...user, imgUrl: data.imgUrl });
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  // all the user with which you can chat
  const [users, setUsers] = useState([]);

  const fetchAllDoctors = () => {
    fetch(`${BASE_URL}/user/doctors/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.doctors);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  const fetchAllPatients = () => {
    fetch(`${BASE_URL}/user/patients/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.patients);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  // if user exist then only connect to socket
  useEffect(() => {
    if (user) {
      socket.connect();

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const [messages, setMessages] = useState([]);

  const sendMessage = (messaget) => {
    const message = messaget.trim();
    if (message.length == 0) {
      toast.error("Invalid Message");
      return;
    }
    // check if receiver and user is there then only we can send message
    if (receiver && user) {
      const payload = {
        message,
        receiverId: receiver._id,
        senderId: user && user._id,
      };

      socket.emit("message-received", payload);
    } else {
      toast.error("Failed to send Message");
    }
  };

  const sendFile = (file) => {
    if (file && user && receiver) {
      const payload = {
        file,
        receiverId: receiver._id,
        senderId: user && user._id,
        fileName: file.name,
      };
      socket.emit("file-receiver", payload);
    } else {
      toast.error("Unable to send File");
    }
  };

  const loadAlltheUsers = () => {
    if (user) {
      if (user.role == "DOCTOR") {
        fetchAllPatients();
      } else if (user.role == "PATIENT") {
        fetchAllDoctors();
      }
    }
  };
  useEffect(() => {
    loadAlltheUsers();
    if (user) fetchAllDepartments();
  }, [user]);

  // CHAT THING IS GOING TO START FROM HERE //

  const [receiver, setReceiver] = useState(null);

  const receivedMessage = (payload) => {
    setMessages((prev) => [...prev, payload]);
  };

  const fetchAllMessages = () => {
    fetch(`${BASE_URL}/user/messages/all/${receiver._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error("Error while loading messages"));
  };

  const fetchPatientByName = (name) => {
    fetch(`${BASE_URL}/user/patients/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.patients);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  const fetchDoctorByName = (name) => {
    fetch(`${BASE_URL}/user/doctors/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.doctors);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  const fetchDoctorsByDepartment = (departmentId) => {
    fetch(`${BASE_URL}/user/doctors/department/${departmentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.doctors);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  const [departments, setDepartments] = useState([]);

  const fetchAllDepartments = () => {
    fetch(`${BASE_URL}/user/departments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user && user.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDepartments(data.departments);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    // if user and receiver exist then only we will add listner as well as fetch messages
    if (user && receiver) {
      fetchAllMessages();
      const messageId =
        user._id >= receiver._id
          ? user._id + receiver._id
          : receiver._id + user._id;

      socket.on(messageId, receivedMessage);

      return () => {
        socket.off(messageId, receivedMessage);
      };
    }
  }, [receiver, user]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      let temp = localStorage.getItem("user");
      temp = JSON.parse(temp);
      setUser(temp);
      let role = temp.role;
      if (role == "DOCTOR") {
        navigate("/doctor/dashboard");
      } else if (role == "PATIENT") {
        navigate("/patient/dashboard");
      } else if (role == "ADMIN") {
        navigate("/admin/dashboard");
      }
    }
  }, []);

  return (
    <HisContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        uploadProfilePic,
        users,
        receiver,
        setReceiver,
        sendMessage,
        messages,
        sendFile,
        fetchPatientByName,
        BASE_URL,
        loadAlltheUsers,
        fetchDoctorByName,
        departments,
        fetchDoctorsByDepartment,
        setLoading,
        loading,
        changePassword,
      }}
    >
      {children}
    </HisContext.Provider>
  );
}
