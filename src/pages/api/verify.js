import { registerScan, getCode, getProductById } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = req.method === 'GET' ? req.query.code : req.body.code;
  const peek = req.query.peek === 'true'; // peek without incrementing if needed

  if (!code) {
    return res.status(400).json({ error: 'Código não fornecido' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Desconhecido';

  if (peek) {
    const raw = getCode(code);
    if (!raw) return res.status(404).json({ found: false });
    const product = getProductById(raw.productId);
    return res.status(200).json({ found: true, ...raw, product });
  }

  const result = registerScan(code, {
    ip: Array.isArray(clientIp) ? clientIp[0] : clientIp.split(',')[0],
    userAgent: userAgent
  });

  if (!result.found) {
    return res.status(404).json({
      found: false,
      message: 'Código inválido ou inexistente'
    });
  }

  return res.status(200).json(result);
}
