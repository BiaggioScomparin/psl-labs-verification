import { getSales, addSale } from '../../../lib/stockService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const sales = await getSales();
      return res.status(200).json(sales);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { client_name, client_phone, items, total_revenue, total_cost, delivery_method, order_id } = req.body;
      if (!client_name || !total_revenue) {
        return res.status(400).json({ error: 'Nome do cliente e valor total são obrigatórios' });
      }
      const newSale = await addSale({
        client_name,
        client_phone,
        items,
        total_revenue,
        total_cost,
        delivery_method,
        order_id
      });
      return res.status(201).json(newSale);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao registrar venda' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
