const express = require("express");
const Shipment = require("../models/Shipment");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const shipments = await Shipment.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return res.json(shipments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch shipments" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { trackingId, origin, destination, status, eta } = req.body;
    if (!trackingId || !origin || !destination) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const shipment = await Shipment.create({
      trackingId,
      origin,
      destination,
      status,
      eta,
      createdBy: req.user.id
    });

    return res.status(201).json(shipment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Tracking ID already exists" });
    }
    return res.status(500).json({ message: "Failed to create shipment" });
  }
});

router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const shipment = await Shipment.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { status },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    return res.json(shipment);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update shipment" });
  }
});

module.exports = router;
