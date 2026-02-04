const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Shipment = require("../models/Shipment");

const seedData = async () => {
  const existingUser = await User.findOne({ email: "demo@ksa-logistics.sa" });
  if (existingUser) {
    return { user: existingUser, seeded: false };
  }

  const passwordHash = await bcrypt.hash("Demo1234", 10);
  const user = await User.create({
    name: "KSA Demo Operator",
    email: "demo@ksa-logistics.sa",
    passwordHash,
    company: "Najm Transport Co."
  });

  const shipments = [
    {
      trackingId: "KSA-RYD-JED-001",
      origin: "Riyadh",
      destination: "Jeddah",
      status: "in-transit",
      eta: new Date(Date.now() + 36 * 60 * 60 * 1000)
    },
    {
      trackingId: "KSA-RYD-DMM-002",
      origin: "Riyadh",
      destination: "Dammam",
      status: "pending",
      eta: new Date(Date.now() + 18 * 60 * 60 * 1000)
    },
    {
      trackingId: "KSA-JED-MED-003",
      origin: "Jeddah",
      destination: "Madinah",
      status: "delivered",
      eta: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      trackingId: "KSA-DMM-KHO-004",
      origin: "Dammam",
      destination: "Al Khobar",
      status: "in-transit",
      eta: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    {
      trackingId: "KSA-ABH-RYD-005",
      origin: "Abha",
      destination: "Riyadh",
      status: "delayed",
      eta: new Date(Date.now() + 48 * 60 * 60 * 1000)
    }
  ];

  await Shipment.insertMany(
    shipments.map((shipment) => ({
      ...shipment,
      createdBy: user._id
    }))
  );

  return { user, seeded: true };
};

module.exports = seedData;
