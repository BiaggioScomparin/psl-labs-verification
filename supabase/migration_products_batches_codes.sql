-- ==============================================================================
-- PSL LABS - MIGRATION: PRODUCTS, BATCHES, CODES & SCANS
-- VPS PostgreSQL / Supabase: https://banco.goib.org
-- ==============================================================================

CREATE TABLE IF NOT EXISTS psl_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  chemical_name TEXT,
  category TEXT,
  concentration TEXT,
  purity TEXT,
  presentation TEXT,
  image TEXT,
  description_py TEXT,
  description_pt TEXT,
  storage_py TEXT,
  storage_pt TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psl_batches (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  batch_number TEXT NOT NULL,
  mfg_date TEXT NOT NULL,
  exp_date TEXT NOT NULL,
  quantity_labels INTEGER DEFAULT 65,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psl_codes (
  code TEXT PRIMARY KEY,
  product_id TEXT,
  batch_id TEXT,
  batch_number TEXT,
  mfg_date TEXT,
  exp_date TEXT,
  scan_count INTEGER DEFAULT 0,
  first_scanned_at TIMESTAMPTZ,
  last_scanned_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS psl_scans (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  ip TEXT,
  user_agent TEXT,
  is_alert BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS & Policies
ALTER TABLE psl_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE psl_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE psl_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE psl_scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total admin products" ON psl_products;
CREATE POLICY "Acesso total admin products" ON psl_products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total admin batches" ON psl_batches;
CREATE POLICY "Acesso total admin batches" ON psl_batches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total admin codes" ON psl_codes;
CREATE POLICY "Acesso total admin codes" ON psl_codes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total admin scans" ON psl_scans;
CREATE POLICY "Acesso total admin scans" ON psl_scans FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON public.psl_products TO anon, authenticated, service_role;
GRANT ALL ON public.psl_batches TO anon, authenticated, service_role;
GRANT ALL ON public.psl_codes TO anon, authenticated, service_role;
GRANT ALL ON public.psl_scans TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
