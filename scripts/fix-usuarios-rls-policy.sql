-- ====================================================================
-- Remove políticas SELECT recursivas da tabela `usuarios` e recria
--   uma versão enxuta que permite leitura apenas de registros ativos.
-- ====================================================================

-- 1) Garantir que RLS esteja ligado (boa prática; pode já estar ON)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 2) Apagar TODAS as políticas SELECT existentes.
--    Ajuste os nomes se tiver políticas adicionais.
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename   = 'usuarios'
        AND permissive  = true
        AND cmd         = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.usuarios;', pol.policyname);
  END LOOP;
END $$;

-- 3) Criar uma nova política SELECT SEM sub-queries/joins recursivos.
CREATE POLICY usuarios_select_public
  ON public.usuarios
  FOR SELECT
  TO anon, authenticated             -- roles usadas pelo Supabase
  USING ( ativo = TRUE );            -- condição direta e segura

-- 4) (Opcional) reveja/ajuste políticas INSERT/UPDATE/DELETE se
--    também contiverem sub-queries recursivas.
-- ====================================================================

/* Verifique:
   SELECT policyname, cmd, roles, qual
   FROM pg_policies
   WHERE tablename = 'usuarios';
*/
