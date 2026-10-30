import { getStats } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getStats());
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
