export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { usernames } = req.body;
  if (!usernames || !Array.isArray(usernames)) {
    return res.status(400).json({ error: 'Missing or invalid usernames array' });
  }

  try {
    const robloxRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames }),
    });

    const data = await robloxRes.json();
    res.status(200).json(data);
  } catch (e) {
    console.error('Proxy error:', e);
    res.status(500).json({ error: 'Failed to contact Roblox API' });
  }
}
