import { getSales, addSale, updateSale, deleteSale } from '../../../lib/stockService.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const sales = await getSales();
      return res.status(200).json(sales);
    } catch (err) {
      console.error("GET /api/admin/vendas error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao buscar vendas' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { client_name, total_revenue } = req.body || {};
      if (!client_name || total_revenue === undefined || total_revenue === null) {
        return res.status(400).json({ error: 'Nome do cliente e valor total da venda são obrigatórios' });
      }
      const newSale = await addSale(req.body);
      return res.status(201).json(newSale);
    } catch (err) {
      console.error("POST /api/admin/vendas error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao registrar venda' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const id = req.body?.id || req.query?.id;
      if (!id) {
        return res.status(400).json({ error: 'ID da venda é obrigatório para atualização' });
      }
      const updated = await updateSale({ ...req.body, id });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("PUT /api/admin/vendas error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao atualizar venda' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'ID da venda é obrigatório para exclusão' });
      }
      const result = await deleteSale(id);
      return res.status(200).json(result);
    } catch (err) {
      console.error("DELETE /api/admin/vendas error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao excluir venda' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
