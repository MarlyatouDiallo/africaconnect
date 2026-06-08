-- ==========================================
-- SUPABASE STORAGE BUCKETS & SECURITY
-- Ce script complète votre configuration 
-- en ajoutant le stockage des images
-- ==========================================

-- 1. Création des Buckets (Dossiers de stockage public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts-images', 'posts-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('stories-images', 'stories-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Sécurité (Policies) pour le stockage

-- A. Tout le monde peut voir les images (Lecture publique)
CREATE POLICY "Public Access to Images" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('posts-images', 'stories-images'));

-- B. Seuls les utilisateurs connectés peuvent envoyer des images
CREATE POLICY "Authenticated Users Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    auth.role() = 'authenticated' 
    AND bucket_id IN ('posts-images', 'stories-images')
);

-- C. Les utilisateurs ne peuvent supprimer que leurs propres images
CREATE POLICY "Users can delete their own images" 
ON storage.objects FOR DELETE 
USING (
    auth.role() = 'authenticated' 
    AND bucket_id IN ('posts-images', 'stories-images')
    AND auth.uid() = owner
);
