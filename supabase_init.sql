-- Create Categories Table
CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Products Table
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Public categories are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (true);

-- Policies for authenticated admins inserting, updating, deleting
CREATE POLICY "Admins can insert categories." ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update categories." ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete categories." ON categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can insert products." ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update products." ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete products." ON products FOR DELETE TO authenticated USING (true);

-- Create product-images bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin storage upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Admin storage delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "Admin storage update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

-- Create Admin Account
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'admin@gdpremium.com.br', crypt('Gdpremium123', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''
);

INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) SELECT 
  gen_random_uuid(), id, id, format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb, 'email', current_timestamp, current_timestamp, current_timestamp 
FROM auth.users 
WHERE email = 'admin@gdpremium.com.br';

-- COMANDOS PARA TABELAS JÁ EXISTENTES:
-- ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
