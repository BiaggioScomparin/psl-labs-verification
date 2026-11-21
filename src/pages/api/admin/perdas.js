import { getLosses, addLoss, updateLoss, deleteLoss } from '../../../lib/stockService.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const losses = await getLosses();
      return res.status(200).json(losses);
    } catch (err) {
      console.error("GET /api/admin/perdas error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao buscar perdas' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, qty, unit_cost, reason, notes, code, compound_id, dosage, category } = req.body || {};
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
      console.error("POST /api/admin/perdas error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao registrar perda' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const id = req.body?.id || req.query?.id;
      if (!id) {
        return res.status(400).json({ error: 'ID da perda é obrigatório para atualização' });
      }
      const updated = await updateLoss({ ...req.body, id });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("PUT /api/admin/perdas error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao atualizar perda' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'ID da perda é obrigatório para exclusão' });
      }
      const result = await deleteLoss(id);
      return res.status(200).json(result);
    } catch (err) {
      console.error("DELETE /api/admin/perdas error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao excluir perda' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
