import React, { useState } from "react";
import { getFirestore, collection, addDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseSetup";
import { auth } from "../firebaseSetup";
import "./Register.css";

const Register = (props) => {
  const db = getFirestore(app);
  const [userData, setUserData] = useState({});

  const addUserToDatabase = async () => {
    if (userData !== {}) {
      if (userData.email !== "" && userData.password !== "") {
        await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        ).then(async (userCredentials) => {
          await addDoc(collection(db, "users"), {
            email: userCredentials.user.email,
            Name: userData.name,
            photoURL: userCredentials.user.photoURL,
            uid: userCredentials.user.uid,
            height: userData.height,
            weight: userData.weight,
            dob: userData.dob,
            gender: "male",
            disease: userData.disease,
            intensity: userData.intensity,
          })
            .then((res) => {
              props.setUser(true);
            })
            .catch((err) => {
              console.log(err);
              userCredentials.user.delete();
            });
        });
      }
    }
  };

  const registerUser = (e) => {
    e.preventDefault();
    for (let index = 0; index < e.target.length; index++) {
      const element = e.target[index];
      setUserData((prev) => {
        return {
          ...prev,
          [element.name]: element.value,
        };
      });
    }

    addUserToDatabase();
  };

  const handleChange = (e) => {
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className="register-form">
      <form onSubmit={registerUser} onChange={handleChange}>
        <label htmlFor="name">Name: </label>
        <input required id="name" type="text" name="name" />
        <label htmlFor="email">Email: </label>
        <input required id="email" type="email" name="email" />
        <label htmlFor="password">Password: </label>
        <input required id="password" type="password" name="password" />
        <label htmlFor="height">Height in cms: </label>
        <input id="height" type="number" name="height" />
        <label htmlFor="weight">Weight in Kgs: </label>
        <input id="weight" type="number" name="weight" />
        <label htmlFor="dob">Date of Birth: </label>
        <input id="dob" type="date" name="dob" />
        <label htmlFor="disease">Any form of Disease: </label>
        <select id="disease" name="disease" defaultValue={0}>
          <option value="none">None</option>
          <option value="asthama">Asthama</option>
          <option value="cancer">Cancer</option>
          <option value="CRD">Chronic Respiratory Diseases</option>
          <option value="alzheimer">Alzheimer's Disease</option>
          <option value="diabetes">Diabetes</option>
        </select>
        <label htmlFor="intensity">Intensity for daily Activity: </label>
        <input id="intensity" type="range" max={5} min={0} name="intensity" />
        <input id="submit-btn" type="submit" />
      </form>
    </div>
  );
};

export default Register;
