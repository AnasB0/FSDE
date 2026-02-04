const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/route-recommendation", auth, async (req, res) => {
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://ai-service:8000";
    if (!aiServiceUrl) {
      return res.status(500).json({ message: "AI service URL not configured" });
    }

    const response = await axios.post(`${aiServiceUrl}/predict`, req.body, {
      timeout: 15000
    });

    return res.json(response.data);
  } catch (error) {
    return res.json({
      recommendation: [
        "Primary corridor recommended based on origin/destination.",
        "Monitor heat advisories and schedule driver rest stops.",
        "Plan checkpoint handoffs near Riyadh, Jeddah, and Dammam hubs."
      ],
      note: "AI service unavailable, returning fallback guidance."
    });
  }
});

module.exports = router;
