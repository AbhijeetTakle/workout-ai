import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import app from "../firebaseSetup";
import { Link } from "react-router-dom";
import "./Mainpage.css";

const Mainpage = (props) => {
  const [user, setUser] = useState(null);
  const db = getFirestore(app);
  useEffect(() => {
    const getUser = async () => {
      const q = query(collection(db, "users"), where("uid", "==", props.user));
      await getDocs(q)
        .then((snap) => {
          snap.forEach((userd) => {
            localStorage.setItem("user", JSON.stringify(userd.data()));
            setUser(userd.data());
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, [db, props.user]);
  const handleLogout = (e) => {
    localStorage.removeItem("user");
    props.setUser(null);
  };
  return (
    <div className="main-container">
      <h1>welcome, {user !== null ? user.Name : ""}</h1>
      <div className="button-container">
        <button>
          <Link to="/profile">Profile</Link>
        </button>
        <button>
          <Link to="/chat">Chat</Link>
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {user !== null ? (
        <div className="personal-info">
          <h4>Name: {user.Name}</h4>
          <h4>Email: {user.email}</h4>
          <h4>Date of birth: {user.dob}</h4>
          <h4>Gender: {user.gender}</h4>
          <h4>height: {user.height}</h4>
          <h4>weight: {user.weight}</h4>
          <h4>disease: {user.disease}</h4>
          <h4>intensity: {user.intensity}</h4>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Mainpage;
