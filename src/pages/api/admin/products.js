import { getProducts, addProduct, updateProduct, deleteProduct } from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const products = await getProducts();
    return res.status(200).json(products);
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

    const created = await addProduct(newProduct);
    return res.status(201).json(created);
  }

  if (req.method === 'PUT') {
    const { id, name, chemicalName, category, concentration, purity, presentation, description_py, description_pt, storage_py, storage_pt, image, active } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'ID do produto é obrigatório para atualização' });
    }

    const updated = await updateProduct(id, {
      name,
      chemicalName,
      category,
      concentration,
      purity,
      presentation,
      description_py,
      description_pt,
      storage_py,
      storage_pt,
      image,
      active: active !== undefined ? active : true
    });

    if (!updated) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const id = req.query.id || req.body?.id;

    if (!id) {
      return res.status(400).json({ error: 'ID do produto é obrigatório para exclusão' });
    }

    const result = await deleteProduct(id);
    if (!result) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
