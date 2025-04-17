import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const data = {
      email_address: email,
      status: 'subscribed', 
    };
    const API_KEY = '9362f880e6bc414c0687a634672b1cae-us18';
    const AUDIENCE_ID = '415abfe0f9';
    const API_SERVER = 'us18';

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