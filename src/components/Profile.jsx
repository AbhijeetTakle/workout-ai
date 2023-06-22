import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import app from "../firebaseSetup";
import "./Profile.css";

const Profile = (props) => {
  const db = getFirestore(app);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getUserInfo = async (usr) => {
      const q = query(collection(db, "users"), where("uid", "==", usr));
      await getDocs(q)
        .then((snap) => {
          snap.forEach((userd) => {
            setUser(userd.data());
            setUserData(userd.data());
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (props.user === null) {
      getUserInfo(JSON.parse(localStorage.getItem("user")).uid);
    } else {
      getUserInfo(props.user);
    }
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();
    const q = query(collection(db, "users"), where("uid", "==", props.user));
    await getDocs(q)
      .then((snap) => {
        snap.forEach((userd) => {
          updateDoc(doc(db, "users", userd.id), {
            email: userData.email,
            Name: userData.name,
            photoURL: userData.photoURL,
            uid: userData.uid,
            height: userData.height,
            weight: userData.weight,
            dob: userData.dob,
            gender: "male",
            disease: userData.disease,
            intensity: userData.intensity,
          })
            .then((res) => {
              alert("updated");
            })
            .catch((err) => {
              alert(err.message);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div>
      <h2>Edit Your Profile</h2>
      {user !== null ? (
        <div className="update-form">
          <form onSubmit={updateUser} onChange={handleChange}>
            <label htmlFor="name">Name: </label>
            <input
              required
              id="name"
              type="text"
              name="name"
              defaultValue={user.Name}
            />
            <label htmlFor="email">Email: </label>
            <input
              required
              id="email"
              type="email"
              name="email"
              defaultValue={user.email}
            />
            <label htmlFor="height">Height in cms: </label>
            <input
              id="height"
              type="number"
              name="height"
              defaultValue={user.height}
            />
            <label htmlFor="weight">Weight in Kgs: </label>
            <input
              id="weight"
              type="number"
              name="weight"
              defaultValue={user.weight}
            />
            <label htmlFor="dob">Date of Birth: </label>
            <input id="dob" type="date" name="dob" defaultValue={user.dob} />
            <label htmlFor="disease">Any form of Disease: </label>
            <select id="disease" name="disease" defaultValue={user.disease}>
              <option value="none">None</option>
              <option value="asthama">Asthama</option>
              <option value="cancer">Cancer</option>
              <option value="CRD">Chronic Respiratory Diseases</option>
              <option value="alzheimer">Alzheimer's Disease</option>
              <option value="diabetes">Diabetes</option>
            </select>
            <label htmlFor="intensity">Intensity for daily Activity: </label>
            <input
              id="intensity"
              type="range"
              max={5}
              min={0}
              name="intensity"
              defaultValue={user.intensity}
            />
            <input id="submit-btn" type="submit" value={"Edit"} />
          </form>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
