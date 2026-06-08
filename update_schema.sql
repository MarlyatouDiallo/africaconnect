-- 1. Ajouter la colonne privacy à la table posts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS privacy VARCHAR(20) DEFAULT 'public' CHECK (privacy IN ('public', 'private'));

-- 2. Supprimer l'ancienne politique de lecture
DROP POLICY IF EXISTS "Allow public read access to posts" ON public.posts;
DROP POLICY IF EXISTS "Allow read access to posts" ON public.posts;

-- 3. Créer la nouvelle politique de confidentialité avec le support des amis
CREATE POLICY "Allow read access to posts" ON public.posts FOR SELECT USING (
    privacy = 'public' 
    OR user_id = auth.uid() 
    OR (privacy = 'private' AND EXISTS (
        SELECT 1 FROM public.followers f1 
        JOIN public.followers f2 ON f1.follower_id = f2.following_id AND f1.following_id = f2.follower_id
        WHERE f1.follower_id = auth.uid() AND f1.following_id = posts.user_id
    ))
);
