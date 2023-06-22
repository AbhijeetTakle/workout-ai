import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import app from "../firebaseSetup";
import "./Chat.css";

const Chat = (props) => {
  const db = getFirestore(app);
  const [usersList, setUsersList] = useState([]);
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const q = query(collection(db, "users"));
      await getDocs(q).then((users) => {
        setUsersList([]);
        users.docs.forEach((doc) => {
          setUsersList((prev) => {
            return [...prev, { id: doc.data().uid, name: doc.data().Name }];
          });
        });
      });
    };
    getUsers();
    setSender(props.user);
  }, [props.user, db]);

  const getMessages = async () => {
    const q = query(
      collection(db, "messages"),
      where("sender", "in", [sender, receiver]),
      where("receiver", "in", [receiver, sender]),
      orderBy("date", "asc")
    );
    setMessages([]);
    await getDocs(q).then((docs) => {
      docs.docs.forEach((doc) => {
        setMessages((prev) => {
          return [...prev, doc.data()];
        });
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "messages"), {
      sender: sender,
      receiver: receiver,
      message: message,
      date: Timestamp.now(),
    }).then(() => {
      getMessages();
    });
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Chat with your freinds.</h1>
      <div className="users-container">
        {usersList.map((user, idx) => {
          if (user.id !== sender)
            return (
              <div key={idx} className="user-div">
                <p>{user.id}</p>
                <p>{user.name}</p>
                <button
                  onClick={(e) => {
                    setReceiver(user.id);
                    getMessages();
                  }}
                >
                  chat
                </button>
              </div>
            );
          else return "";
        })}
      </div>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((msg, idx) => {
            return (
              <div
                className="message"
                key={idx}
                style={{
                  backgroundColor: msg.sender === sender ? "blue" : "gray",
                  alignSelf: msg.sender === sender ? "flex-end" : "flex-start",
                }}
              >
                <p>{msg.message}</p>
              </div>
            );
          })}
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: "50px" }}
        >
          <label htmlFor="message">Message:</label>
          <input
            type="text"
            name="message"
            id="message"
            style={{ width: "60%" }}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input type="submit" value={"send"} />
        </form>
      </div>
    </div>
  );
};

export default Chat;
