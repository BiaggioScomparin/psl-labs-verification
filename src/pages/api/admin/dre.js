import { getDRESummary } from '../../../lib/stockService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const summary = await getDRESummary();
      return res.status(200).json(summary);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao consolidar DRE' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
