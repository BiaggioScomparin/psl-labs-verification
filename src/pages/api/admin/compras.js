import { getPurchases, addPurchase } from '../../../lib/stockService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const purchases = await getPurchases();
      return res.status(200).json(purchases);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar compras' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, qty, unit_cost, supplier, notes, code, compound_id, dosage, category } = req.body;
      if (!name || !qty || !unit_cost) {
        return res.status(400).json({ error: 'Nome, quantidade e custo unitário são obrigatórios' });
      }
      const newPurchase = await addPurchase({
        name,
        qty,
        unit_cost,
        supplier,
        notes,
        code,
        compound_id,
        dosage,
        category
      });
      return res.status(201).json(newPurchase);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao registrar compra' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
