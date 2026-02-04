const mongoose = require("mongoose");

const ShipmentSchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-transit", "delivered", "delayed"],
      default: "pending"
    },
    eta: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", ShipmentSchema);
