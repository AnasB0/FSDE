import React, { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleAuth = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  return (
    <div className="app-shell">
      {token ? (
        <Dashboard token={token} onLogout={() => handleAuth(null)} />
      ) : (
        <Login onAuth={handleAuth} />
      )}
    </div>
  );
};

export default App;
