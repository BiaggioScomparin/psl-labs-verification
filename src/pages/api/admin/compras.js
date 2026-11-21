import { getPurchases, addPurchase, updatePurchase, deletePurchase } from '../../../lib/stockService.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const purchases = await getPurchases();
      return res.status(200).json(purchases);
    } catch (err) {
      console.error("GET /api/admin/compras error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao buscar compras' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, qty, unit_cost, supplier, notes, code, compound_id, dosage, category } = req.body || {};
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
      console.error("POST /api/admin/compras error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao registrar compra' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const id = req.body?.id || req.query?.id;
      if (!id) {
        return res.status(400).json({ error: 'ID da compra é obrigatório para atualização' });
      }
      const updated = await updatePurchase({ ...req.body, id });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("PUT /api/admin/compras error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao atualizar compra' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'ID da compra é obrigatório para exclusão' });
      }
      const result = await deletePurchase(id);
      return res.status(200).json(result);
    } catch (err) {
      console.error("DELETE /api/admin/compras error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao excluir compra' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
