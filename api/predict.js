export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers.authorization;

  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Prediction ID dibutuhkan' });

    try {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
        headers: { 'Authorization': token }
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'Image URL dibutuhkan' });

    try {
      const response = await fetch('https://api.replicate.com/v1/models/stability-ai/stable-video-diffusion/predictions', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            input_image: imageUrl,
            motion_bucket_id: 127,
            cond_aug: 0.02,
            steps: 25
          }
        })
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
