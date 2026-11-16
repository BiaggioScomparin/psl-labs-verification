import { getInventory, updateStockQty } from '../../../lib/stockService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const inventory = await getInventory();
      return res.status(200).json(inventory);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar estoque' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { code, qty, is_ready_sp } = req.body;
      if (!code || qty === undefined) {
        return res.status(400).json({ error: 'Código e quantidade são obrigatórios' });
      }
      const updated = await updateStockQty(code, qty, is_ready_sp);
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar estoque' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
