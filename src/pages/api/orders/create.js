import { createOrder } from '../../../lib/stockService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { client_name, client_phone, client_address, items, delivery_method, subtotal, shipping_cost, total } = req.body;
      const order = await createOrder({
        client_name,
        client_phone,
        client_address,
        items,
        delivery_method,
        subtotal,
        shipping_cost,
        total
      });
      return res.status(201).json(order);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao registrar pedido' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
