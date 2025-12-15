import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';

const collegeSchema = z.object({
  name: z.string().min(1, 'College name is required').max(200),
  college_type: z.enum(['arts', 'engineering', 'medical', 'law', 'dental', 'pharmacy', 'agriculture', 'veterinary', 'polytechnic', 'management', 'education']),
  district_id: z.string().uuid('Please select a district'),
  counseling_code: z.string().max(50).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email('Invalid email').max(100).optional().nullable().or(z.literal('')),
  website: z.string().url('Invalid URL').max(200).optional().nullable().or(z.literal('')),
  established_year: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  affiliation: z.string().max(200).optional().nullable(),
  accreditation: z.string().max(200).optional().nullable(),
  infrastructure_rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  placement_rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  image_url: z.string().url('Invalid URL').max(500).optional().nullable().or(z.literal('')),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

interface District {
  id: string;
  name: string;
}

interface CollegeFormProps {
  collegeId?: string;
  initialData?: Partial<CollegeFormData>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CollegeForm({ collegeId, initialData, onSuccess, onCancel }: CollegeFormProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const { toast } = useToast();

  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: initialData || {
      name: '',
      college_type: 'engineering',
      district_id: '',
      counseling_code: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      established_year: undefined,
      affiliation: '',
      accreditation: '',
      infrastructure_rating: undefined,
      placement_rating: undefined,
      description: '',
      image_url: '',
    },
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    const { data } = await supabase.from('districts').select('id, name').order('name');
    if (data) setDistricts(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('college-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('college-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: CollegeFormData) => {
    setLoading(true);
    try {
      // Upload image if a file was selected
      let imageUrl = data.image_url || null;
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Convert empty strings to null for optional fields
      const payload: Omit<Database['public']['Tables']['colleges']['Insert'], 'created_at' | 'updated_at' | 'id'> = {
        name: data.name,
        college_type: data.college_type,
        district_id: data.district_id,
        email: data.email || null,
        website: data.website || null,
        image_url: imageUrl,
        counseling_code: data.counseling_code || null,
        address: data.address || null,
        phone: data.phone || null,
        affiliation: data.affiliation || null,
        accreditation: data.accreditation || null,
        description: data.description || null,
        established_year: data.established_year || null,
        infrastructure_rating: data.infrastructure_rating || null,
        placement_rating: data.placement_rating || null,
      };

      if (collegeId) {
        const { error } = await supabase.from('colleges').update(payload).eq('id', collegeId);
        if (error) throw error;
        toast({ title: 'Success', description: 'College updated successfully' });
      } else {
        const { error } = await supabase.from('colleges').insert([payload]);
        if (error) throw error;
        toast({ title: 'Success', description: 'College added successfully' });
      }
      onSuccess();
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save college',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>College Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter college name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="college_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="arts">Arts & Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="veterinary">Veterinary</SelectItem>
                    <SelectItem value="polytechnic">Polytechnic</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="counseling_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Counseling Code</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="e.g., E001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="established_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Established Year</FormLabel>
                <FormControl>
                  <Input {...field} type="number" value={field.value || ''} placeholder="e.g., 1990" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="infrastructure_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Infrastructure Rating (1-5)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" max="5" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="placement_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placement Rating (1-5)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" max="5" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="+91 1234567890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} type="email" placeholder="contact@college.edu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="https://www.college.edu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affiliation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Affiliation</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="e.g., VTU, JNTU" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accreditation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accreditation</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="e.g., NAAC A++, NBA" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} placeholder="Full address" rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>College Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            field.onChange('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={uploading}
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          {...field}
                          value={field.value || ''}
                          placeholder="Or paste image URL"
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value) {
                              setImagePreview(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} placeholder="College description" rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {collegeId ? 'Update' : 'Add'} College
          </Button>
        </div>
      </form>
    </Form>
  );
}
