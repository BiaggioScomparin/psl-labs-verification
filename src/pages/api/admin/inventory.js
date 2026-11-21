import { 
  getInventory, 
  updateStockQty, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../../../lib/stockService.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const inventory = await getInventory();
      return res.status(200).json(inventory);
    } catch (err) {
      console.error("GET /api/admin/inventory error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao buscar estoque' });
    }
  }

  if (req.method === 'POST') {
    try {
      const code = req.body?.code;
      if (!code) {
        return res.status(400).json({ error: 'Código (code) é obrigatório' });
      }
      const newItem = await createInventoryItem(req.body);
      return res.status(201).json(newItem);
    } catch (err) {
      console.error("POST /api/admin/inventory error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao criar item no estoque' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const code = req.body?.code || req.query?.code;
      if (!code) {
        return res.status(400).json({ error: 'Código (code) é obrigatório' });
      }

      // Support both legacy quick qty update { code, qty, is_ready_sp }
      // AND full item update { code, name, dosage, category, unit_cost, price_b2c, price_b2b, stock_qty, min_stock, is_ready_sp }
      const itemData = { ...req.body };
      if (itemData.qty !== undefined && itemData.stock_qty === undefined) {
        itemData.stock_qty = itemData.qty;
      }

      const updated = await updateInventoryItem(code, itemData);
      return res.status(200).json(updated);
    } catch (err) {
      console.error("PUT /api/admin/inventory error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao atualizar estoque' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const code = req.query?.code || req.body?.code;
      if (!code) {
        return res.status(400).json({ error: 'Código (code) é obrigatório para exclusão' });
      }
      const result = await deleteInventoryItem(code);
      return res.status(200).json(result);
    } catch (err) {
      console.error("DELETE /api/admin/inventory error:", err);
      return res.status(500).json({ error: err.message || 'Erro ao excluir item do estoque' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
