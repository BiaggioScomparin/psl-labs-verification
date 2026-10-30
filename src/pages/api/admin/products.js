import { getProducts, addProduct } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getProducts());
  }

  if (req.method === 'POST') {
    const { name, chemicalName, category, concentration, purity, presentation, description_py, description_pt, storage_py, storage_pt, image } = req.body;
    
    if (!name || !concentration) {
      return res.status(400).json({ error: 'Nome e concentração são obrigatórios' });
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct = {
      id,
      name,
      chemicalName: chemicalName || name,
      category: category || 'Peptídeos & Saúde',
      concentration,
      purity: purity || '99.0% (HPLC)',
      presentation: presentation || 'Frasco Vial Liofilizado',
      image: image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      description_py: description_py || `${name} de alta pureza desarrollado bajo estándares de PSL LABS Paraguay.`,
      description_pt: description_pt || `${name} de alta pureza desenvolvido sob padrões da PSL LABS Paraguai.`,
      storage_py: storage_py || 'Conservar entre 2°C y 8°C.',
      storage_pt: storage_pt || 'Conservar entre 2°C e 8°C.',
      active: true
    };

    addProduct(newProduct);
    return res.status(201).json(newProduct);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
