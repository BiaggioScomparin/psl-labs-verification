import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const compoundsPath = path.join(rootDir, 'src', 'data', 'compounds.json');
const rawCompounds = fs.readFileSync(compoundsPath, 'utf8').replace(/^\uFEFF/, '');
const compounds = JSON.parse(rawCompounds);

let sql = `-- ==============================================================================
-- PSL LABS (PREMIUM SYNTHESIS LINE) - SUPABASE DATABASE SCHEMA
-- Sistema Completo de Gestão de Estoque, Compras, Vendas, Perdas, DRE e Pedidos
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE ESTOQUE (INVENTORY)
CREATE TABLE IF NOT EXISTS psl_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compound_id TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  category TEXT NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 5,
  is_ready_sp BOOLEAN NOT NULL DEFAULT false,
  unit_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  price_b2c NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  price_b2b NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE COMPRAS / ENTRADAS (PURCHASES)
CREATE TABLE IF NOT EXISTS psl_purchases (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL DEFAULT 'peptide',
  compound_id TEXT,
  code TEXT,
  name TEXT NOT NULL,
  dosage TEXT,
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  supplier TEXT DEFAULT 'Fábrica Chinesa / SinoPept',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA DE PERDAS / AVARIAS (LOSSES)
CREATE TABLE IF NOT EXISTS psl_losses (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL DEFAULT 'peptide',
  compound_id TEXT,
  code TEXT,
  name TEXT NOT NULL,
  dosage TEXT,
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  loss_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  reason TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELA DE VENDAS / FATURAMENTO (SALES)
CREATE TABLE IF NOT EXISTS psl_sales (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_revenue NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  gross_profit NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  margin_percent NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  delivery_method TEXT DEFAULT 'sedex',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABELA DE PEDIDOS DA LOJA ONLINE (ORDERS)
CREATE TABLE IF NOT EXISTS psl_orders (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_address TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  delivery_method TEXT DEFAULT 'sedex',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status TEXT DEFAULT 'pending_pix',
  whatsapp_sent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABELA DE PREÇOS PERSONALIZADOS
CREATE TABLE IF NOT EXISTS psl_custom_prices (
  code TEXT PRIMARY KEY,
  price_b2c NUMERIC(10,2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TRIGGERS AUTOMÁTICOS PARA ATUALIZAÇÃO DE ESTOQUE
-- Trigger A: Entrada via Compra
CREATE OR REPLACE FUNCTION fn_trg_purchase_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NOT NULL AND NEW.code <> '' THEN
    UPDATE psl_inventory
    SET stock_qty = stock_qty + NEW.qty,
        unit_cost = NEW.unit_cost,
        is_ready_sp = (stock_qty + NEW.qty > 0),
        updated_at = NOW()
    WHERE code = NEW.code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_purchase_stock_ai ON psl_purchases;
CREATE TRIGGER trg_purchase_stock_ai
AFTER INSERT ON psl_purchases
FOR EACH ROW EXECUTE FUNCTION fn_trg_purchase_stock();

-- Trigger B: Baixa via Perda
CREATE OR REPLACE FUNCTION fn_trg_loss_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NOT NULL AND NEW.code <> '' THEN
    UPDATE psl_inventory
    SET stock_qty = GREATEST(0, stock_qty - NEW.qty),
        is_ready_sp = (stock_qty - NEW.qty > 0),
        updated_at = NOW()
    WHERE code = NEW.code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_loss_stock_ai ON psl_losses;
CREATE TRIGGER trg_loss_stock_ai
AFTER INSERT ON psl_losses
FOR EACH ROW EXECUTE FUNCTION fn_trg_loss_stock();

-- 9. VIEW CONSOLIDADA DE DRE (DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO)
CREATE OR REPLACE VIEW v_psl_dre AS
SELECT
  COALESCE((SELECT SUM(total_revenue) FROM psl_sales), 0.00) AS receita_bruta,
  COALESCE((SELECT SUM(total_cost) FROM psl_sales), 0.00) AS cmv,
  COALESCE((SELECT SUM(gross_profit) FROM psl_sales), 0.00) AS lucro_bruto,
  CASE 
    WHEN COALESCE((SELECT SUM(total_revenue) FROM psl_sales), 0) > 0 THEN
      ROUND(((COALESCE((SELECT SUM(gross_profit) FROM psl_sales), 0) / (SELECT SUM(total_revenue) FROM psl_sales)) * 100), 1)
    ELSE 0.0
  END AS margem_bruta_percent,
  COALESCE((SELECT SUM(loss_total) FROM psl_losses), 0.00) AS total_perdas,
  COALESCE((SELECT SUM(total_cost) FROM psl_purchases), 0.00) AS total_compras_investido,
  COALESCE((SELECT SUM(stock_qty * unit_cost) FROM psl_inventory), 0.00) AS estoque_valor_custo,
  COALESCE((SELECT SUM(stock_qty * price_b2c) FROM psl_inventory), 0.00) AS estoque_valor_venda,
  COALESCE((SELECT SUM(stock_qty) FROM psl_inventory), 0) AS total_frascos_estoque;

-- 10. POLÍTICAS DE ACESSO (ROW LEVEL SECURITY - RLS)
ALTER TABLE psl_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE psl_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE psl_losses ENABLE ROW LEVEL SECURITY;
ALTER TABLE psl_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE psl_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE psl_custom_prices ENABLE ROW LEVEL SECURITY;

-- Leitura pública para o catálogo da loja
DROP POLICY IF EXISTS "Permitir leitura pública do estoque" ON psl_inventory;
CREATE POLICY "Permitir leitura pública do estoque" ON psl_inventory FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública de preços" ON psl_custom_prices;
CREATE POLICY "Permitir leitura pública de preços" ON psl_custom_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção de pedidos pelos clientes" ON psl_orders;
CREATE POLICY "Permitir inserção de pedidos pelos clientes" ON psl_orders FOR INSERT WITH CHECK (true);

-- Acesso irrestrito via Chave Anônima/Autenticada para o painel admin PSL Labs
DROP POLICY IF EXISTS "Acesso total admin inventory" ON psl_inventory;
CREATE POLICY "Acesso total admin inventory" ON psl_inventory FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total admin purchases" ON psl_purchases;
CREATE POLICY "Acesso total admin purchases" ON psl_purchases FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total admin losses" ON psl_losses;
CREATE POLICY "Acesso total admin losses" ON psl_losses FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total admin sales" ON psl_sales;
CREATE POLICY "Acesso total admin sales" ON psl_sales FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total admin orders" ON psl_orders;
CREATE POLICY "Acesso total admin orders" ON psl_orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso total admin custom_prices" ON psl_custom_prices;
CREATE POLICY "Acesso total admin custom_prices" ON psl_custom_prices FOR ALL USING (true);

-- 11. CARGA INICIAL (SEED) DE TODOS OS 47 COMPOSTOS E SKUS
INSERT INTO psl_inventory (compound_id, code, name, dosage, category, stock_qty, min_stock, is_ready_sp, unit_cost, price_b2c, price_b2b) VALUES
`;

const values = [];
compounds.forEach(comp => {
  comp.doses.forEach(dose => {
    const isCu50 = (dose.code === 'CU50' || comp.id === 'ghk-cu');
    const stockQty = isCu50 ? 29 : 0;
    const isReady = stockQty > 0;
    const nameSafe = comp.name.replace(/'/g, "''");
    const catSafe = (comp.line || comp.category || 'Peptídeos').replace(/'/g, "''");
    const dosageSafe = dose.label.replace(/'/g, "''");
    
    values.push(`  ('${comp.id}', '${dose.code}', '${nameSafe}', '${dosageSafe}', '${catSafe}', ${stockQty}, 5, ${isReady}, ${dose.totalCostB2C || 0}, ${dose.suggestedPriceB2C || 0}, ${dose.b2bBoxPrice || 0})`);
  });
});

sql += values.join(',\n') + '\nON CONFLICT (code) DO NOTHING;\n\n';

sql += `-- 12. CARGA INICIAL DE COMPRAS E PERDAS REAIS (HISTÓRICO)
INSERT INTO psl_purchases (id, date, category, compound_id, code, name, dosage, qty, unit_cost, total_cost, supplier, notes)
VALUES ('CMP-001', '2026-11-10', 'peptide', 'ghk-cu', 'CU50', 'GHK-Cu', '50mg', 40, 25.40, 1016.00, 'Fábrica Chinesa / SinoPept', 'Lote de 40 frascos registrado')
ON CONFLICT (id) DO NOTHING;

INSERT INTO psl_losses (id, date, category, compound_id, code, name, dosage, qty, unit_cost, loss_total, reason, notes)
VALUES 
  ('PRD-001', '2026-11-11', 'peptide', 'ghk-cu', 'CU50', 'GHK-Cu', '50mg', 10, 25.40, 254.00, 'Fornecedor não enviou', 'Faltaram 10 frascos na remessa do fornecedor'),
  ('PRD-002', '2026-11-12', 'peptide', 'ghk-cu', 'CU50', 'GHK-Cu', '50mg', 1, 25.40, 25.40, 'Uso próprio', 'Retirado 1 frasco para protocolo pessoal')
ON CONFLICT (id) DO NOTHING;
`;

const outputPath = path.join(rootDir, 'supabase', 'schema.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log('✓ Arquivo supabase/schema.sql gerado com sucesso! Tamanho:', sql.length, 'bytes');
