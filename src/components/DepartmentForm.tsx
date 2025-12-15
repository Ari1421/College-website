import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(200),
  hod_name: z.string().max(200).optional().nullable(),
  intake_capacity: z.coerce.number().int().min(1).optional().nullable(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  collegeId: string;
  departmentId?: string;
  initialData?: Partial<DepartmentFormData>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DepartmentForm({ collegeId, departmentId, initialData, onSuccess, onCancel }: DepartmentFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: initialData || {
      name: '',
      hod_name: '',
      intake_capacity: undefined,
    },
  });

  const onSubmit = async (data: DepartmentFormData) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        hod_name: data.hod_name || null,
        intake_capacity: data.intake_capacity || null,
        college_id: collegeId,
      };

      if (departmentId) {
        const { error } = await supabase
          .from('departments')
          .update(payload)
          .eq('id', departmentId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Department updated successfully' });
      } else {
        const { error } = await supabase.from('departments').insert([payload]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Department added successfully' });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save department',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Computer Science Engineering" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hod_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Head of Department</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="e.g., Dr. John Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intake_capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intake Capacity</FormLabel>
              <FormControl>
                <Input {...field} type="number" value={field.value || ''} placeholder="e.g., 60" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {departmentId ? 'Update' : 'Add'} Department
          </Button>
        </div>
      </form>
    </Form>
  );
}
