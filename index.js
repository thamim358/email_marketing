import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Create member data for Mailchimp
    const data = {
      email_address: email,
      status: 'subscribed', // Use 'pending' if you want double opt-in
    };

    // Your Mailchimp API key
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    // Your audience ID (also called List ID)
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    // API server region (from your API key, like us6, us12, etc.)
    const API_SERVER = process.env.MAILCHIMP_API_SERVER;

    const response = await fetch(
      `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`
        },
        body: JSON.stringify(data)
      }
    );

    const responseData = await response.json();

    if (response.status >= 400) {
      if (responseData.title === 'Member Exists') {
        return res.status(400).json({ message: 'You are already subscribed!' });
      }
      return res.status(400).json({ message: responseData.detail || 'Error subscribing to newsletter' });
    }

    return res.status(201).json({ message: 'Success! You are now subscribed.' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});