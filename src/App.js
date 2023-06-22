import { useEffect, useState } from "react";
import "./App.css";
import Authentication from "./components/Authentication";
import Mainpage from "./components/Mainpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== null) {
      setUser(user.uid);
    }
  }, []);
  return (
    <div className="App" style={{ height: "100%" }}>
      {
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                user === null ? (
                  <Authentication setUser={setUser} />
                ) : (
                  <Mainpage user={user} setUser={setUser} />
                )
              }
            />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/chat" element={<Chat user={user} />} />
          </Routes>
        </Router>
      }
    </div>
  );
}

export default App;
