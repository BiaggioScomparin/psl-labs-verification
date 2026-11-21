import { getStats } from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const stats = await getStats();
    return res.status(200).json(stats);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
