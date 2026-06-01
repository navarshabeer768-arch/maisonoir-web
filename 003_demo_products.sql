-- ============================================================
-- MAISON NOIR — Demo Products with Real Images
-- Run AFTER 001_schema.sql and 002_functions.sql
-- ============================================================

-- First insert demo brands
INSERT INTO brands (slug, name, description, country_of_origin, is_featured, is_active) VALUES
  ('tom-ford', 'Tom Ford', 'American luxury fashion house known for bold, sensual fragrances', 'United States', true, true),
  ('creed', 'Creed', 'Historic French fragrance house established in 1760', 'France', true, true),
  ('amouage', 'Amouage', 'Omani luxury perfume house crafting the most precious fragrances', 'Oman', true, true),
  ('maison-margiela', 'Maison Margiela', 'Iconic French fashion house with avant-garde fragrance line', 'France', true, true),
  ('lattafa', 'Lattafa Perfumes', 'Leading UAE-based Arabic perfume house', 'United Arab Emirates', true, true),
  ('xerjoff', 'Xerjoff', 'Italian luxury niche perfume house', 'Italy', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  v_women_id UUID;
  v_men_id UUID;
  v_unisex_id UUID;
  v_arabic_id UUID;
  v_niche_id UUID;

  v_tf_id UUID;
  v_creed_id UUID;
  v_amouage_id UUID;
  v_mm_id UUID;
  v_lattafa_id UUID;
  v_xerjoff_id UUID;

  v_p1 UUID; v_p2 UUID; v_p3 UUID; v_p4 UUID; v_p5 UUID;
  v_p6 UUID; v_p7 UUID; v_p8 UUID; v_p9 UUID; v_p10 UUID;
BEGIN
  SELECT id INTO v_women_id FROM categories WHERE slug = 'women';
  SELECT id INTO v_men_id FROM categories WHERE slug = 'men';
  SELECT id INTO v_unisex_id FROM categories WHERE slug = 'unisex';
  SELECT id INTO v_arabic_id FROM categories WHERE slug = 'arabic-perfumes';
  SELECT id INTO v_niche_id FROM categories WHERE slug = 'niche-fragrances';

  SELECT id INTO v_tf_id FROM brands WHERE slug = 'tom-ford';
  SELECT id INTO v_creed_id FROM brands WHERE slug = 'creed';
  SELECT id INTO v_amouage_id FROM brands WHERE slug = 'amouage';
  SELECT id INTO v_mm_id FROM brands WHERE slug = 'maison-margiela';
  SELECT id INTO v_lattafa_id FROM brands WHERE slug = 'lattafa';
  SELECT id INTO v_xerjoff_id FROM brands WHERE slug = 'xerjoff';

  -- ============================================================
  -- PRODUCT 1: Tom Ford Oud Wood
  -- ============================================================
  INSERT INTO products (slug, name, tagline, description, brand_id, category_id, fragrance_family, concentration, gender_target, perfumer, release_year, country_of_origin, status, is_featured, is_bestseller, longevity_rating, sillage_rating, projection_rating, versatility_rating)
  VALUES ('tom-ford-oud-wood', 'Oud Wood', 'Rare oud wood meets smoky sandalwood', 'A groundbreaking fragrance that made oud accessible to the Western world. Rare oud wood is blended with sandalwood, rosewood, cardamom, and a hint of smoky vetiver for a warm, sophisticated aura.', v_tf_id, v_men_id, 'woody', 'edp', 'unisex', 'Pierre Negrin', 2007, 'United States', 'active', true, true, 4.5, 4.0, 4.0, 5.0)
  RETURNING id INTO v_p1;

  INSERT INTO product_variants (product_id, size_ml, sku, price, compare_at_price, stock_quantity, is_active) VALUES
    (v_p1, 50, 'TF-OW-50', 285, NULL, 45, true),
    (v_p1, 100, 'TF-OW-100', 425, NULL, 30, true),
    (v_p1, 250, 'TF-OW-250', 695, NULL, 15, true);

  INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
    (v_p1, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', 'Tom Ford Oud Wood bottle', true, 0),
    (v_p1, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', 'Tom Ford Oud Wood fragrance', false, 1);

  -- ============================================================
  -- PRODUCT 2: Creed Aventus
  -- ============================================================
  INSERT INTO products (slug, name, tagline, description, brand_id, category_id, fragrance_family, concentration, gender_target, perfumer, release_year, country_of_origin, status, is_featured, is_bestseller, is_exclusive, longevity_rating, sillage_rating, projection_rating, versatility_rating)
  VALUES ('creed-aventus', 'Aventus', 'The king of fragrances', 'Inspired by the tumultuous life of Napoleon Bonaparte, Aventus celebrates strength, power, and success. A masterpiece of fruity-woody composition with blackcurrant, bergamot, pineapple, and birch.', v_creed_id, v_men_id, 'woody', 'edp', 'men', 'Olivier Creed', 2010, 'France', 'active', true, true, true, 4.5, 5.0, 5.0, 4.5)
  RETURNING id INTO v_p2;

  INSERT INTO product_variants (product_id, size_ml, sku, price, compare_at_price, stock_quantity, is_active) VALUES
    (v_p2, 50, 'CR-AV-50', 395, NULL, 25, true),
    (v_p2, 100, 'CR-AV-100', 595, NULL, 20, true);

  INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
    (v_p2, 'https://images.unsplash.com/photo-1587017539504-67cfbbbe4aa4?w=600&q=80', 'Creed Aventus bottle', true, 0),
    (v_p2, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 'Creed Aventus display', false, 1);

  -- ============================================================
  -- PRODUCT 3: Amouage Reflection
  -- ============================================================
  INSERT INTO products (slug, name, tagline, description, brand_id, category_id, fragrance_family, concentration, gender_target, release_year, country_of_origin, status, is_featured, is_new_arrival, longevity_rating, sillage_rating, projection_rating, versatility_rating)
  VALUES ('amouage-reflection-woman', 'Reflection Woman', 'A floral poem of rare beauty', 'A luminous, sophisticated floral fragrance combining narcissus, rose, ylang-ylang, and sandalwood. Reflection Woman is a meditative, introspective composition.', v_amouage_id, v_women_id, 'floral', 'edp', 'women', 2007, 'Oman', 'active', true, false, 4.0, 4.5, 4.0, 4.0)
  RETURNING id INTO v_p3;

  INSERT INTO product_variants (product_id, size_ml, sku, price, stock_quantity, is_active) VALUES
    (v_p3, 50, 'AM-RF-50', 320, 35, true),
    (v_p3, 100, 'AM-RF-100', 480, 20, true);

  INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
    (v_p3, 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80', 'Amouage Reflection Woman', true, 0);

  -- ============================================================
  -- PRODUCT 4: Maison Margiela Replica Jazz Club
  -- ============================================================
  INSERT INTO products (slug, name, tagline, description, brand_id, category_id, fragrance_family, concentration, gender_target, release_year, country_of_origin, status, is_featured, is_bestseller, longevity_rating, sillage_rating, projection_rating, versatility_rating)
  VALUES ('mmm-replica-jazz-club', 'Replica Jazz Club', 'The warmth of a 1960s jazz bar', 'A warm, inviting composition inspired by the atmosphere of a classic jazz club. Notes of rum, pink pepper, vetiver, musk, and tobacco leave create an addictive smoky warmth.', v_mm_id, v_unisex_id, 'woody', 'edt', 'unisex', 2013, 'France', 'active', false, true, 3.5, 3.5, 3.5, 5.0)
  RETURNING id INTO v_p4;

  INSERT INTO product_variants (product_id, size_ml, sku, price, stock_quantity, is_active) VALUES
    (v_p4, 30, 'MM-JC-30', 120, 50, true),
    (v_p4, 100, 'MM-JC-100', 195, 40, true),
    (v_p4, 200, 'MM-JC-200', 295, 20, true);

  INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
    (v_p4, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', 'Maison Margiela Jazz Club', true, 0),
    (v_p4, 'https://images.unsplash.com/photo-1590736969596-c25e2d0f17f1?w=600&q=80', 'Jazz Club fragrance detail', false, 1);

  -- ============================================================
  -- PRODUCT 5: Lattafa Oud Mood
  -- ============================================================
  INSERT INTO products (slug, name, name_ar, tagline, description, brand_id, category_id, fragrance_family, concentration, gender_target, release_year, country_of_origin, status, is_featured, is_arabic_collection, is_new_arrival, longevity_rating, sillage_rating, projection_rating, versatility_rating)
  VALUES ('lattafa-oud-mood', 'Oud Mood', 'عود موود', 'Deep Arabian oud for the modern connoisseur', 'A rich, deep Arabian oud fragrance with layers of rose, saffron, amber, and precious woods. An authentic expression of Gulf perfumery tradition wrapped in modern sophistication.', v_lattafa_id, v_arabic_id, 'arabic_oriental', 'edp', 'unisex', 2021, 'United Arab Emirates', 'active', true, true, true, 5.0, 5.0, 5.0, 3.5)
  RETURNING id INTO v_p5;

  INSERT INTO product_variants (product_id, size_ml, sku, price, compare_at_price, stock_quantity, is_active) VALUES
    (v_p5, 100, 'LAT-OM-100', 89, 120, 60, true),
    (v_p5, 200, 'LAT-OM-200', 149, 180, 30, true);

  INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
    (v_p5, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'Lattafa Oud Mood', true, 0),
    (v_p5, 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=600&q=80', 'Arabian oud bottle', false, 1);

  -- ============================================================
  -- PRODUCT 6: Xerjoff Naxos
  -- ============================================================
  INSERT INTO products (slug, name, tagline, description, brand_id, category_id, fragrance_family, concentration, gender_target, release_year, country_of_origin, status, is_featured, is_exclusive, is_niche, longevity_rating, sillage_rating, projection_rating, versatility_rating)
  VALUES ('xerjoff-naxos', 'Naxos', 'Italian luxury in a bottle', 'Named after the Greek island of Naxos, this masterpiece combines bergamot, lavender, honey, tonka bean, tobacco, and vanilla in a warm, sensual oriental composition.', v_xerjoff_id, v_niche_id, 'oriental', 'edp', 'unisex', 2016, 'Italy', 'active', true, true, true, 4.5, 4.5, 4.5, 4.0)
  RETURNING id INTO v_p6;

  INSERT INTO product_variants (product_id, size_ml, sku, price, stock_quantity, is_active) VALUES
    (v_p6, 50, 'XJ-NX-50', 295, 20, true),
    (v_p6, 100, 'XJ-NX-100', 445, 15, true);

  INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
    (v_p6, 'https://images.unsplash.com/photo-1566977776052-6e61e35bf9be?w=600&q=80', 'Xerjoff Naxos', true, 0);

  -- ============================================================
  -- PRODUCT 7: Tom Ford Black Orchid
  -- ============================================================
  INSERT INTO products (slug, name, tagline, description, brand_id, category_id, fragrance_family, concentration, gender_target, perfumer, release_year, country_of_origin, status, is_featured, is_bestseller, longevity_rating, sillage_rating, projection_rating, versatility_rating)
  VALUES ('tom-ford-black-orchid', 'Black Orchid', 'A dark floral of extraordinary depth', 'A luxurious and sensual fragrance of great complexity. Dark florals meld with black truffle, ylang-ylang, blackcurrant, lotus wood, and a deep dark chocolate accord.', v_tf_id, v_women_id, 'oriental', 'edp', 'women', 'David Apel', 2006, 'United States', 'active', true, true, 5.0, 4.5, 4.5, 4.0)
  RETURNING id INTO v_p7;

  INSERT INTO product_variants (product_id, size_ml, sku, price, stock_quantity, is_active) VALUES
    (v_p7, 30, 'TF-BO-30', 195, 40, true),
    (v_p7, 50, 'TF-BO-50', 265, 30, true),
    (v_p7, 100, 'TF-BO-100', 395, 20, true);

  INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
    (v_p7, 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&q=80', 'Tom Ford Black Orchid', true, 0),
    (v_p7, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80', 'Black Orchid luxury', false, 1);

  -- ============================================================
  -- PRODUCT 8: Creed Silver Mountain Water
  -- ============================================================
  INSERT INTO products (slug, name, tagline, description, brand_id, category_id, fragrance_family, concentration, gender_target, release_year, country_of_origin, status, is_new_arrival, is_featured, longevity_rating, sillage_rating, projection_rating, versatility_rating)
  VALUES ('creed-silver-mountain-water', 'Silver Mountain Water', 'The crisp freshness of Alpine peaks', 'Inspired by the pure, clear waters of the Swiss Alps. A fresh, aquatic fragrance with green tea, bergamot, neroli, sandalwood, and musk.', v_creed_id, v_men_id, 'aquatic', 'edp', 'men', 1995, 'France', 'active', true, false, 3.5, 4.0, 3.5, 5.0)
  RETURNING id INTO v_p8;

  INSERT INTO product_variants (product_id, size_ml, sku, price, stock_quantity, is_active) VALUES
    (v_p8, 50, 'CR-SMW-50', 355, 30, true),
    (v_p8, 100, 'CR-SMW-100', 525, 20, true);

  INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order) VALUES
    (v_p8, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80', 'Creed Silver Mountain Water', true, 0);

END $$;

-- Update total_sold for demo
UPDATE products SET total_sold = floor(random() * 500 + 50)::int WHERE total_sold = 0;
UPDATE products SET is_new_arrival = true WHERE slug IN ('amouage-reflection-woman', 'creed-silver-mountain-water');

SELECT p.name, b.name as brand, p.status, p.is_featured, COUNT(pv.id) as variants, COUNT(pi.id) as images
FROM products p
LEFT JOIN brands b ON b.id = p.brand_id
LEFT JOIN product_variants pv ON pv.product_id = p.id
LEFT JOIN product_images pi ON pi.product_id = p.id
GROUP BY p.id, p.name, b.name, p.status, p.is_featured
ORDER BY p.created_at DESC;
