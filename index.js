import express from "express";
import cors from "cors";
import { StreamClient } from "@stream-io/node-sdk";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/token", async (req, res) => {
  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request body" });
  }

  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;
  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: "Missing API credentials" });
  }

  try {
    const client = new StreamClient(apiKey, apiSecret);
    const token = client.createToken(userId);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("Token generation error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Token server running on port ${port}`);
});
