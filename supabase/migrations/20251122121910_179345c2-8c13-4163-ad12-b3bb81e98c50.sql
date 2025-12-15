-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Admins can insert colleges" ON public.colleges;
DROP POLICY IF EXISTS "Admins can update colleges" ON public.colleges;
DROP POLICY IF EXISTS "Admins can delete colleges" ON public.colleges;

DROP POLICY IF EXISTS "Admins can insert departments" ON public.departments;
DROP POLICY IF EXISTS "Admins can update departments" ON public.departments;
DROP POLICY IF EXISTS "Admins can delete departments" ON public.departments;

DROP POLICY IF EXISTS "Admins can insert districts" ON public.districts;
DROP POLICY IF EXISTS "Admins can update districts" ON public.districts;
DROP POLICY IF EXISTS "Admins can delete districts" ON public.districts;

-- Create new policies allowing anyone to manage colleges
CREATE POLICY "Anyone can insert colleges" ON public.colleges
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update colleges" ON public.colleges
FOR UPDATE TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can delete colleges" ON public.colleges
FOR DELETE TO anon, authenticated
USING (true);

-- Create new policies allowing anyone to manage departments
CREATE POLICY "Anyone can insert departments" ON public.departments
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update departments" ON public.departments
FOR UPDATE TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can delete departments" ON public.departments
FOR DELETE TO anon, authenticated
USING (true);

-- Create new policies allowing anyone to manage districts
CREATE POLICY "Anyone can insert districts" ON public.districts
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update districts" ON public.districts
FOR UPDATE TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can delete districts" ON public.districts
FOR DELETE TO anon, authenticated
USING (true);