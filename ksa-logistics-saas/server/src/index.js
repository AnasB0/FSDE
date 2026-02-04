require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const seedData = require("./config/seed");

const authRoutes = require("./routes/auth");
const shipmentRoutes = require("./routes/shipments");
const aiRoutes = require("./routes/ai");

const app = express();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "ksa-logistics-server",
    health: "/health",
    docs: "Use /api/auth and /api/shipments endpoints"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ksa-logistics-server" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ksa-logistics-server" });
});

app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 4000;

connectDb()
  .then(async () => {
    if (process.env.SEED_DATA === "true") {
      try {
        const result = await seedData();
        if (result.seeded) {
          console.log("Seeded demo data for demo@ksa-logistics.sa");
        }
      } catch (error) {
        console.error("Failed to seed demo data", error);
      }
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
    process.exit(1);
  });
