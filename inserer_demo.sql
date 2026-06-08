-- ==========================================
-- SCRIPT D'INSERTION DES DONNÉES DE DÉMO
-- Exécute ce script directement dans l'éditeur SQL de Supabase
-- ==========================================

-- 1. On crée un compte "Super Admin" directement dans la base pour contourner la limite d'emails de Supabase
-- (Le mot de passe de ce compte sera '123456789')
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo_marliadiallo2131@gmail.com', -- J'ai rajouté 'demo_' pour éviter le blocage
  crypt('123456789', gen_salt('bf')),
  now(), -- On valide l'email automatiquement !
  '{"username":"Marlyatou_Diallo", "avatar":"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200", "bio":"Auteure du projet AfricaConnect 🇬🇳"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Le compte au-dessus déclenche ton Trigger, ce qui crée la ligne dans 'public.users'.

-- 2. On insère de force les 5 belles images de présentation
INSERT INTO public.posts (user_id, image_url, description, category, likes_count, comments_count, views_count)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1621612716172-87a419eb2da8?q=80&w=800', 'Une vue magnifique depuis les montagnes du Fouta Djallon. La nature sauvage à perte de vue ! ⛰️🌳 #fouta #nature #guinee', 'montagne', 145, 4, 1204),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1596489379685-64bc9ba93910?q=80&w=800', 'Le marché de Madina, un lieu vibrant où la culture et l''artisanat se rencontrent au quotidien. 🛍️🇬🇳 #conakry #ville #culture', 'ville', 289, 6, 2540),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=800', 'Un bon plat de riz au gras avec du poisson braisé. La vraie gastronomie africaine ! 🐟🌶️🥘 #cuisine #guinee #gastronomie', 'gastronomie', 98, 3, 852),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1590483864461-1ff5b23d944e?q=80&w=800', 'Promenade matinale sur les magnifiques plages des îles de Loos. Le calme absolu. 🏝️🌊 #plage #ilesdeloos #detente', 'plage', 62, 2, 420),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1620608552608-8e68e4c73045?q=80&w=800', 'Rencontre inoubliable avec la faune locale au parc national. Protégeons notre patrimoine naturel. 🐘🌿 #faune #nature #afrique', 'faune', 114, 1, 730);
