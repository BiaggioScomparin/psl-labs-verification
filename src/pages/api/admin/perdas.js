import { getLosses, addLoss } from '../../../lib/stockService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const losses = await getLosses();
      return res.status(200).json(losses);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar perdas' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, qty, unit_cost, reason, notes, code, compound_id, dosage, category } = req.body;
      if (!name || !qty || !reason) {
        return res.status(400).json({ error: 'Nome, quantidade e motivo são obrigatórios' });
      }
      const newLoss = await addLoss({
        name,
        qty,
        unit_cost,
        reason,
        notes,
        code,
        compound_id,
        dosage,
        category
      });
      return res.status(201).json(newLoss);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao registrar perda' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
