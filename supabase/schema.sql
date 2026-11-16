-- ==============================================================================
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
  ('retatrutide', 'RT5', 'Retatrutide', '5mg', 'Metabolismo & Shape', 0, 5, false, 75.6, 309, 710),
  ('retatrutide', 'RT10', 'Retatrutide', '10mg', 'Metabolismo & Shape', 0, 5, false, 88, 359, 910),
  ('retatrutide', 'RT15', 'Retatrutide', '15mg', 'Metabolismo & Shape', 0, 5, false, 112.6, 459, 1320),
  ('retatrutide', 'RT20', 'Retatrutide', '20mg', 'Metabolismo & Shape', 0, 5, false, 121.8, 489, 1470),
  ('retatrutide', 'RT30', 'Retatrutide', '30mg', 'Metabolismo & Shape', 0, 5, false, 146.5, 589, 1880),
  ('retatrutide', 'RT40', 'Retatrutide', '40mg', 'Metabolismo & Shape', 0, 5, false, 164.2, 659, 2170),
  ('retatrutide', 'RT50', 'Retatrutide', '50mg', 'Metabolismo & Shape', 0, 5, false, 166.5, 669, 2210),
  ('retatrutide', 'RT60', 'Retatrutide', '60mg', 'Metabolismo & Shape', 0, 5, false, 186.1, 749, 2530),
  ('retatrutide', 'RT80', 'Retatrutide', '80mg', 'Metabolismo & Shape', 0, 5, false, 194.2, 779, 2660),
  ('retatrutide', 'RT100', 'Retatrutide', '100mg', 'Metabolismo & Shape', 0, 5, false, 258.9, 1039, 3730),
  ('retatrutide', 'RT120', 'Retatrutide', '120mg', 'Metabolismo & Shape', 0, 5, false, 328.2, 1319, 4880),
  ('tirzepatide', 'TR5', 'Tirzepatide', '5mg', 'Metabolismo & Shape', 0, 5, false, 74.1, 299, 680),
  ('tirzepatide', 'TR10', 'Tirzepatide', '10mg', 'Metabolismo & Shape', 0, 5, false, 81.8, 329, 810),
  ('tirzepatide', 'TR15', 'Tirzepatide', '15mg', 'Metabolismo & Shape', 0, 5, false, 91, 369, 960),
  ('tirzepatide', 'TR20', 'Tirzepatide', '20mg', 'Metabolismo & Shape', 0, 5, false, 101.8, 409, 1140),
  ('tirzepatide', 'TR30', 'Tirzepatide', '30mg', 'Metabolismo & Shape', 0, 5, false, 121.8, 489, 1470),
  ('tirzepatide', 'TR40', 'Tirzepatide', '40mg', 'Metabolismo & Shape', 0, 5, false, 131.1, 529, 1620),
  ('tirzepatide', 'TR50', 'Tirzepatide', '50mg', 'Metabolismo & Shape', 0, 5, false, 149.6, 599, 1930),
  ('tirzepatide', 'TR60', 'Tirzepatide', '60mg', 'Metabolismo & Shape', 0, 5, false, 169.6, 679, 2260),
  ('tirzepatide', 'TR80', 'Tirzepatide', '80mg', 'Metabolismo & Shape', 0, 5, false, 185, 749, 2510),
  ('tirzepatide', 'TR100', 'Tirzepatide', '100mg', 'Metabolismo & Shape', 0, 5, false, 205.8, 829, 2860),
  ('semaglutide', 'SM10', 'Semaglutide', '10mg', 'Metabolismo & Shape', 0, 5, false, 78.7, 319, 760),
  ('semaglutide', 'SM20', 'Semaglutide', '20mg', 'Metabolismo & Shape', 0, 5, false, 91, 369, 960),
  ('semaglutide', 'SM30', 'Semaglutide', '30mg', 'Metabolismo & Shape', 0, 5, false, 115.7, 469, 1370),
  ('semaglutide', 'SM40', 'Semaglutide', '40mg', 'Metabolismo & Shape', 0, 5, false, 128, 519, 1570),
  ('semaglutide', 'SM50', 'Semaglutide', '50mg', 'Metabolismo & Shape', 0, 5, false, 155.7, 629, 2030),
  ('bpc-tb', 'BB10', 'Blend BPC-157 + TB-500', '10mg', 'Regeneração & Articulações', 0, 5, false, 115.7, 469, 1370),
  ('bpc-tb', 'BB20', 'Blend BPC-157 + TB-500', '20mg', 'Regeneração & Articulações', 0, 5, false, 158.8, 639, 2080),
  ('bpc-tb', 'BB30', 'Blend BPC-157 + TB-500', '30mg', 'Regeneração & Articulações', 0, 5, false, 171.1, 689, 2280),
  ('bpc-tb', 'BB40', 'Blend BPC-157 + TB-500', '40mg', 'Regeneração & Articulações', 0, 5, false, 212.7, 859, 2970),
  ('bpc157', 'BC5', 'BPC-157', '5mg', 'Regeneração & Articulações', 0, 5, false, 78.7, 319, 760),
  ('bpc157', 'BC10', 'BPC-157', '10mg', 'Regeneração & Articulações', 0, 5, false, 88, 359, 910),
  ('bpc157', 'BC20', 'BPC-157', '20mg', 'Regeneração & Articulações', 0, 5, false, 106.4, 429, 1220),
  ('tb500', 'BT5', 'TB-500 (Full Chain)', '5mg', 'Regeneração & Articulações', 0, 5, false, 100.3, 409, 1120),
  ('tb500', 'BT10', 'TB-500 (Full Chain)', '10mg', 'Regeneração & Articulações', 0, 5, false, 137.2, 549, 1720),
  ('nad', 'NJ100', 'NAD+', '100mg', 'Longevidade & Biohacking', 0, 5, false, 69.5, 279, 610),
  ('nad', 'NJ500', 'NAD+', '500mg', 'Longevidade & Biohacking', 0, 5, false, 75.6, 309, 710),
  ('nad', 'NJ1000', 'NAD+', '1000mg', 'Longevidade & Biohacking', 0, 5, false, 84.9, 349, 860),
  ('ghk-cu', 'CU50', 'GHK-Cu (Blue Copper)', '50mg', 'Estética & Pele', 29, 5, true, 66.4, 269, 560),
  ('ghk-cu', 'CU100', 'GHK-Cu (Blue Copper)', '100mg', 'Estética & Pele', 29, 5, true, 71, 289, 630),
  ('cjc-ipa', 'CP10', 'Blend CJC-1295 + Ipamorelin', '10mg', 'Massa Magra & GH', 0, 5, false, 128, 519, 1570),
  ('cjc-ipa', 'CP20', 'Blend CJC-1295 + Ipamorelin', '20mg', 'Massa Magra & GH', 0, 5, false, 161.5, 649, 2130),
  ('epithalon', 'ET10', 'Epithalon', '10mg', 'Longevidade & Biohacking', 0, 5, false, 88, 359, 910),
  ('epithalon', 'ET50', 'Epithalon', '50mg', 'Longevidade & Biohacking', 0, 5, false, 149.6, 599, 1930),
  ('semax-selank', 'XS20', 'Blend Semax + Selank', '20mg', 'Cérebro & Foco', 0, 5, false, 158.8, 639, 2080),
  ('semax', 'SX5', 'Semax', '5mg', 'Cérebro & Foco', 0, 5, false, 78.7, 319, 760),
  ('semax', 'SX10', 'Semax', '10mg', 'Cérebro & Foco', 0, 5, false, 89.5, 359, 940),
  ('selank', 'SK5', 'Selank', '5mg', 'Cérebro & Foco', 0, 5, false, 77.2, 309, 730),
  ('selank', 'SK10', 'Selank', '10mg', 'Cérebro & Foco', 0, 5, false, 91, 369, 960),
  ('5amino1mq', '5AM', '5-AMINO-1MQ', '5mg', 'Metabolismo & Shape', 0, 5, false, 72.6, 299, 660),
  ('5amino1mq', '10AM', '5-AMINO-1MQ', '10mg', 'Metabolismo & Shape', 0, 5, false, 81.8, 329, 810),
  ('5amino1mq', '50AM', '5-AMINO-1MQ', '50mg', 'Metabolismo & Shape', 0, 5, false, 97.2, 389, 1060),
  ('pt141', 'P41', 'PT-141 (Bremelanotide)', '10mg', 'Imunidade & Vitalidade', 0, 5, false, 103.4, 419, 1170),
  ('mots-c', 'MS10', 'MOTS-c', '10mg', 'Metabolismo & Shape', 0, 5, false, 97.2, 389, 1060),
  ('mots-c', 'MS15', 'MOTS-c', '15mg', 'Metabolismo & Shape', 0, 5, false, 112.6, 459, 1320),
  ('mots-c', 'MS20', 'MOTS-c', '20mg', 'Metabolismo & Shape', 0, 5, false, 131.1, 529, 1620),
  ('mots-c', 'MS40', 'MOTS-c', '40mg', 'Metabolismo & Shape', 0, 5, false, 166.9, 669, 2210),
  ('tesa-ipa', 'TI10', 'Blend Tesamorelin + Ipamorelin', '10mg', 'Metabolismo & Shape', 0, 5, false, 131.1, 529, 1620),
  ('tesa-ipa', 'TI15', 'Blend Tesamorelin + Ipamorelin', '15mg', 'Metabolismo & Shape', 0, 5, false, 166.9, 669, 2210),
  ('tesamorelin', 'TSM2', 'Tesamorelin', '2mg', 'Metabolismo & Shape', 0, 5, false, 81.8, 329, 810),
  ('tesamorelin', 'TSM5', 'Tesamorelin', '5mg', 'Metabolismo & Shape', 0, 5, false, 121.8, 489, 1470),
  ('tesamorelin', 'TSM10', 'Tesamorelin', '10mg', 'Metabolismo & Shape', 0, 5, false, 161.9, 649, 2130),
  ('tesamorelin', 'TSM20', 'Tesamorelin', '20mg', 'Metabolismo & Shape', 0, 5, false, 201.2, 809, 2780),
  ('ipamorelin', 'IP5', 'Ipamorelin', '5mg', 'Massa Magra & GH', 0, 5, false, 75.6, 309, 710),
  ('ipamorelin', 'IP10', 'Ipamorelin', '10mg', 'Massa Magra & GH', 0, 5, false, 94.1, 379, 1010),
  ('cjc-dac', 'CD5', 'CJC-1295 (com DAC)', '5mg', 'Massa Magra & GH', 0, 5, false, 158.8, 639, 2080),
  ('cjc-dac', 'CD10', 'CJC-1295 (com DAC)', '10mg', 'Massa Magra & GH', 0, 5, false, 196.5, 789, 2700),
  ('cjc-nodac', 'CND5', 'CJC-1295 (sem DAC)', '5mg', 'Massa Magra & GH', 0, 5, false, 100.3, 409, 1120),
  ('cjc-nodac', 'CND10', 'CJC-1295 (sem DAC)', '10mg', 'Massa Magra & GH', 0, 5, false, 137.2, 549, 1720),
  ('cagrilintide', 'CGL5', 'Cagrilintide', '5mg', 'Metabolismo & Shape', 0, 5, false, 134.2, 539, 1670),
  ('cagrilintide', 'CGL10', 'Cagrilintide', '10mg', 'Metabolismo & Shape', 0, 5, false, 158.8, 639, 2080),
  ('açãod9604', 'AD5', 'AOD-9604', '5mg', 'Massa Magra & GH', 0, 5, false, 112.6, 459, 1320),
  ('açãod9604', 'AD10', 'AOD-9604', '10mg', 'Massa Magra & GH', 0, 5, false, 155.7, 629, 2030),
  ('ahk-cu', 'AU20', 'AHK-Cu', '20mg', 'Imunidade & Vitalidade', 0, 5, false, 69.5, 279, 610),
  ('ahk-cu', 'AU50', 'AHK-Cu', '50mg', 'Imunidade & Vitalidade', 0, 5, false, 75.6, 309, 710),
  ('ahk-cu', 'AU100', 'AHK-Cu', '100mg', 'Imunidade & Vitalidade', 0, 5, false, 84.9, 349, 860),
  ('thymosin-a1', 'TA5', 'Thymosin Alpha 1', '5mg', 'Imunidade & Vitalidade', 0, 5, false, 121.8, 489, 1470),
  ('thymosin-a1', 'TA10', 'Thymosin Alpha 1', '10mg', 'Imunidade & Vitalidade', 0, 5, false, 164.2, 659, 2170),
  ('glutathione', 'GTT600', 'Glutathione', '600mg', 'Longevidade & Biohacking', 0, 5, false, 78.7, 319, 760),
  ('glutathione', 'GTT1500', 'Glutathione', '1500mg', 'Longevidade & Biohacking', 0, 5, false, 97.2, 389, 1060),
  ('adamax', 'AX5', 'Adamax', '5mg', 'Cérebro & Foco', 0, 5, false, 97.2, 389, 1060),
  ('adamax', 'AX10', 'Adamax', '10mg', 'Cérebro & Foco', 0, 5, false, 134.2, 539, 1670),
  ('dsip', 'DS5', 'DSIP', '5mg', 'Regeneração & Articulações', 0, 5, false, 84.9, 349, 860),
  ('dsip', 'DS10', 'DSIP', '10mg', 'Regeneração & Articulações', 0, 5, false, 106.4, 429, 1220),
  ('kpv', 'KPV2', 'KPV', '2mg', 'Imunidade & Vitalidade', 0, 5, false, 64.9, 269, 530),
  ('kpv', 'KPV5', 'KPV', '5mg', 'Imunidade & Vitalidade', 0, 5, false, 71, 289, 630),
  ('kpv', 'KPV10', 'KPV', '10mg', 'Imunidade & Vitalidade', 0, 5, false, 88, 359, 910),
  ('ss31', '2S10', 'SS-31 (Elamipretide)', '10mg', 'Imunidade & Vitalidade', 0, 5, false, 118.8, 479, 1420),
  ('ss31', '2S20', 'SS-31 (Elamipretide)', '20mg', 'Imunidade & Vitalidade', 0, 5, false, 166.9, 669, 2210),
  ('ss31', '2S50', 'SS-31 (Elamipretide)', '50mg', 'Imunidade & Vitalidade', 0, 5, false, 208.1, 839, 2890),
  ('foxo4', 'F42', 'FOXO4-DRI', '2mg', 'Longevidade & Biohacking', 0, 5, false, 128, 519, 1570),
  ('foxo4', 'FOX10', 'FOXO4-DRI', '10mg', 'Longevidade & Biohacking', 0, 5, false, 386, 1549, 5830),
  ('melanotan2', 'MT210', 'Melanotan II', '10mg', 'Estética & Pele', 0, 5, false, 103.4, 419, 1170),
  ('kisspeptin', 'KS5', 'Kisspeptin-10', '5mg', 'Imunidade & Vitalidade', 0, 5, false, 100.3, 409, 1120),
  ('kisspeptin', 'KS10', 'Kisspeptin-10', '10mg', 'Imunidade & Vitalidade', 0, 5, false, 137.2, 549, 1720),
  ('sermorelin', 'SMO5', 'Sermorelin', '5mg', 'Massa Magra & GH', 0, 5, false, 103.4, 419, 1170),
  ('sermorelin', 'SMO10', 'Sermorelin', '10mg', 'Massa Magra & GH', 0, 5, false, 146.5, 589, 1880),
  ('vip', 'VP5', 'VIP', '5mg', 'Imunidade & Vitalidade', 0, 5, false, 161.9, 649, 2130),
  ('vip', 'VP10', 'VIP', '10mg', 'Imunidade & Vitalidade', 0, 5, false, 178, 719, 2400),
  ('ara290', 'RA10', 'ARA-290', '10mg', 'Regeneração & Articulações', 0, 5, false, 103.4, 419, 1170),
  ('ara290', 'RA16', 'ARA-290', '16mg', 'Regeneração & Articulações', 0, 5, false, 128, 519, 1570),
  ('snap8', 'NP810', 'Snap-8', '10mg', 'Estética & Pele', 0, 5, false, 97.2, 389, 1060),
  ('oxytocin', 'OT2', 'Oxytocin', '2mg', 'Cérebro & Foco', 0, 5, false, 66.4, 269, 560),
  ('oxytocin', 'OT5', 'Oxytocin', '5mg', 'Cérebro & Foco', 0, 5, false, 78.7, 319, 760),
  ('oxytocin', 'OT10', 'Oxytocin', '10mg', 'Cérebro & Foco', 0, 5, false, 84.9, 349, 860),
  ('thymalin', 'TY10', 'Thymalin', '10mg', 'Regeneração & Articulações', 0, 5, false, 100.3, 409, 1120),
  ('igf1', 'IG1-1', 'IGF-1 LR3', '1mg', 'Massa Magra & GH', 0, 5, false, 172.3, 699, 2300),
  ('igf1', 'IG01', 'IGF-1 LR3', '100mcg', 'Massa Magra & GH', 0, 5, false, 81.8, 329, 810),
  ('reta-tirz', 'RET60', 'Blend Retatrutide + Tirzepatide', '60mg', 'Imunidade & Vitalidade', 0, 5, false, 158.8, 639, 2080),
  ('lcarnitine', 'LC600', 'L-Carnitina Injetável', '600mg', 'Metabolismo & Shape', 0, 5, false, 88, 359, 910),
  ('lcarnitine', 'LC1200', 'L-Carnitina Injetável', '1200mg', 'Metabolismo & Shape', 0, 5, false, 106.4, 429, 1220),
  ('lemonbottle', 'LemonBottle', 'Lemon Bottle', '10ml', 'Metabolismo & Shape', 0, 5, false, 88, 359, 910),
  ('lipoc', 'Lipo-C', 'Lipo-C', '10ml', 'Metabolismo & Shape', 0, 5, false, 112.6, 459, 1320),
  ('mic', 'MIC', 'MIC (Lipo C com B12)', '10mg', 'Metabolismo & Shape', 0, 5, false, 106.4, 429, 1220),
  ('b12', 'B12', 'Vitamina B12', '10ml', 'Imunidade & Vitalidade', 0, 5, false, 72.6, 299, 660),
  ('glow', 'GLOW', 'Kit Glow & Klow', '70mg', 'Estética & Pele', 0, 5, false, 158.8, 639, 2080),
  ('glow', 'Klow', 'Kit Glow & Klow', '80mg', 'Estética & Pele', 0, 5, false, 169.6, 679, 2260)
ON CONFLICT (code) DO NOTHING;

-- 12. CARGA INICIAL DE COMPRAS E PERDAS REAIS (HISTÓRICO)
INSERT INTO psl_purchases (id, date, category, compound_id, code, name, dosage, qty, unit_cost, total_cost, supplier, notes)
VALUES ('CMP-001', '2026-11-10', 'peptide', 'ghk-cu', 'CU50', 'GHK-Cu', '50mg', 40, 25.40, 1016.00, 'Fábrica Chinesa / SinoPept', 'Lote de 40 frascos registrado')
ON CONFLICT (id) DO NOTHING;

INSERT INTO psl_losses (id, date, category, compound_id, code, name, dosage, qty, unit_cost, loss_total, reason, notes)
VALUES 
  ('PRD-001', '2026-11-11', 'peptide', 'ghk-cu', 'CU50', 'GHK-Cu', '50mg', 10, 25.40, 254.00, 'Fornecedor não enviou', 'Faltaram 10 frascos na remessa do fornecedor'),
  ('PRD-002', '2026-11-12', 'peptide', 'ghk-cu', 'CU50', 'GHK-Cu', '50mg', 1, 25.40, 25.40, 'Uso próprio', 'Retirado 1 frasco para protocolo pessoal')
ON CONFLICT (id) DO NOTHING;

-- 13. FUNÇÃO RPC PARA BAIXA EM VENDAS
CREATE OR REPLACE FUNCTION fn_decrement_stock(p_code TEXT, p_qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE psl_inventory
  SET stock_qty = GREATEST(0, stock_qty - p_qty),
      is_ready_sp = (stock_qty - p_qty > 0),
      updated_at = NOW()
  WHERE code = p_code;
END;
$$ LANGUAGE plpgsql;
