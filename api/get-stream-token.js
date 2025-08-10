import { StreamVideoServerClient } from '@stream-io/video-node';

// Initialize the server client with API key + secret
const serverClient = new StreamVideoServerClient({
  apiKey: process.env.STREAM_API_KEY,
  apiSecret: process.env.STREAM_API_SECRET,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in request body' });
    }

    // Generate a valid JWT token for this user
    const token = serverClient.createToken(userId);

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
}
