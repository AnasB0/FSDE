import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api.js";

const Dashboard = ({ token, onLogout }) => {
  const [shipments, setShipments] = useState([]);
  const [form, setForm] = useState({
    trackingId: "",
    origin: "",
    destination: "",
    status: "pending"
  });
  const [aiInput, setAiInput] = useState({
    origin: "",
    destination: "",
    vehicleType: "Truck",
    constraints: ""
  });
  const [aiOutput, setAiOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthToken(token);
    loadShipments();
  }, [token]);

  const loadShipments = async () => {
    try {
      const response = await api.get("/shipments");
      setShipments(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }
      setError("Unable to load shipments");
    }
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAiChange = (event) => {
    setAiInput({ ...aiInput, [event.target.name]: event.target.value });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/shipments", form);
      setForm({ trackingId: "", origin: "", destination: "", status: "pending" });
      loadShipments();
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }
      setError(err.response?.data?.message || "Failed to create shipment");
    }
  };

  const handleAiSubmit = async (event) => {
    event.preventDefault();
    setAiOutput("");
    try {
      const response = await api.post("/ai/route-recommendation", aiInput);
      setAiOutput(
        Array.isArray(response.data.recommendation)
          ? response.data.recommendation.join("\n")
          : response.data.recommendation
      );
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }
      setAiOutput("AI recommendation unavailable");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Operations Control Center</h2>
          <p>Saudi Arabia corridor visibility and risk insights.</p>
        </div>
        <button className="secondary-btn" onClick={onLogout}>
          Sign out
        </button>
      </header>

      {error && <div className="error-text">{error}</div>}

      <section className="grid">
        <div className="card">
          <h3>Create Shipment</h3>
          <form onSubmit={handleCreate} className="form-grid">
            <input
              name="trackingId"
              placeholder="Tracking ID"
              value={form.trackingId}
              onChange={handleChange}
              required
            />
            <input
              name="origin"
              placeholder="Origin (Riyadh)"
              value={form.origin}
              onChange={handleChange}
              required
            />
            <input
              name="destination"
              placeholder="Destination (Jeddah)"
              value={form.destination}
              onChange={handleChange}
              required
            />
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in-transit">In transit</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
            <button type="submit" className="primary-btn">
              Add shipment
            </button>
          </form>
        </div>

        <div className="card">
          <h3>AI Route Intelligence</h3>
          <form onSubmit={handleAiSubmit} className="form-grid">
            <input
              name="origin"
              placeholder="Origin"
              value={aiInput.origin}
              onChange={handleAiChange}
            />
            <input
              name="destination"
              placeholder="Destination"
              value={aiInput.destination}
              onChange={handleAiChange}
            />
            <input
              name="vehicleType"
              placeholder="Vehicle type"
              value={aiInput.vehicleType}
              onChange={handleAiChange}
            />
            <input
              name="constraints"
              placeholder="Constraints (heat, rest, permits)"
              value={aiInput.constraints}
              onChange={handleAiChange}
            />
            <button type="submit" className="primary-btn">
              Generate recommendation
            </button>
          </form>
          {aiOutput && <pre className="ai-output">{aiOutput}</pre>}
        </div>
      </section>

      <section className="card">
        <h3>Active Shipments</h3>
        <div className="table">
          <div className="table-row header">
            <span>Tracking</span>
            <span>Origin</span>
            <span>Destination</span>
            <span>Status</span>
          </div>
          {shipments.map((shipment) => (
            <div className="table-row" key={shipment._id}>
              <span>{shipment.trackingId}</span>
              <span>{shipment.origin}</span>
              <span>{shipment.destination}</span>
              <span className={`status ${shipment.status}`}>{shipment.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
