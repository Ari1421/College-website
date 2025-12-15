-- Add more college types to the enum
ALTER TYPE college_type ADD VALUE IF NOT EXISTS 'law';
ALTER TYPE college_type ADD VALUE IF NOT EXISTS 'dental';
ALTER TYPE college_type ADD VALUE IF NOT EXISTS 'pharmacy';
ALTER TYPE college_type ADD VALUE IF NOT EXISTS 'agriculture';
ALTER TYPE college_type ADD VALUE IF NOT EXISTS 'veterinary';
ALTER TYPE college_type ADD VALUE IF NOT EXISTS 'polytechnic';
ALTER TYPE college_type ADD VALUE IF NOT EXISTS 'management';
ALTER TYPE college_type ADD VALUE IF NOT EXISTS 'education';

-- Create storage bucket for college images
INSERT INTO storage.buckets (id, name, public)
VALUES ('college-images', 'college-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for college images
CREATE POLICY "Anyone can view college images"
ON storage.objects FOR SELECT
USING (bucket_id = 'college-images');

CREATE POLICY "Anyone can upload college images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'college-images');

CREATE POLICY "Anyone can update college images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'college-images');

CREATE POLICY "Anyone can delete college images"
ON storage.objects FOR DELETE
USING (bucket_id = 'college-images');