import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Building, TrendingUp, Award, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CollegeForm } from '@/components/CollegeForm';
import { RoleGate } from '@/components/RoleGate';

export default function Dashboard() {
  const [stats, setStats] = useState<any>({ engineering: [], medical: [], arts: [], topInfrastructure: [], topPlacement: [] });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const [eng, med, arts, infra, place] = await Promise.all([
      supabase.from('colleges').select('*').eq('college_type', 'engineering').order('infrastructure_rating', { ascending: false }).limit(5),
      supabase.from('colleges').select('*').eq('college_type', 'medical').order('infrastructure_rating', { ascending: false }).limit(5),
      supabase.from('colleges').select('*').eq('college_type', 'arts').order('infrastructure_rating', { ascending: false }).limit(5),
      supabase.from('colleges').select('*').order('infrastructure_rating', { ascending: false }).limit(5),
      supabase.from('colleges').select('*').order('placement_rating', { ascending: false }).limit(5),
    ]);

    setStats({
      engineering: eng.data || [],
      medical: med.data || [],
      arts: arts.data || [],
      topInfrastructure: infra.data || [],
      topPlacement: place.data || [],
    });
  };

  const handleAddSuccess = () => {
    setAddDialogOpen(false);
    fetchDashboardData();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <RoleGate allow="admin">
            <Button onClick={() => setAddDialogOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add College
            </Button>
          </RoleGate>
        </div>
        
        <div className="grid gap-8">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />Top Engineering Colleges</CardTitle></CardHeader><CardContent><ul className="space-y-2">{stats.engineering.map((c: any) => <li key={c.id} className="flex justify-between"><span>{c.name}</span><span className="text-accent font-semibold">{c.infrastructure_rating}/5</span></li>)}</ul></CardContent></Card>
          
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Top Medical Colleges</CardTitle></CardHeader><CardContent><ul className="space-y-2">{stats.medical.map((c: any) => <li key={c.id} className="flex justify-between"><span>{c.name}</span><span className="text-accent font-semibold">{c.infrastructure_rating}/5</span></li>)}</ul></CardContent></Card>
          
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Best Placement Records</CardTitle></CardHeader><CardContent><ul className="space-y-2">{stats.topPlacement.map((c: any) => <li key={c.id} className="flex justify-between"><span>{c.name}</span><span className="text-primary font-semibold">{c.placement_rating}/5</span></li>)}</ul></CardContent></Card>
        </div>
      </main>
      <Footer />

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New College</DialogTitle>
          </DialogHeader>
          <CollegeForm
            onSuccess={handleAddSuccess}
            onCancel={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
