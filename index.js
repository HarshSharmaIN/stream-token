// index.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { StreamVideoServerClient } from '@stream-io/node-sdk';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

app.post('/token', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in request body' });
    }

    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: 'Missing API credentials' });
    }

    const serverClient = new StreamVideoServerClient(apiKey, apiSecret);
    const token = serverClient.createToken(userId);

    return res.status(200).json({ token });
  } catch (err) {
    console.error('Token generation error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
